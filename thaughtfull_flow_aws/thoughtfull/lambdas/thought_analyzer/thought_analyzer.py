import base64
import hashlib
import hmac
import json
import logging
import os
import secrets
from uuid import uuid4

from bedrock.sending_request_to_bedrock import analyze_thought, classify_thought
from send_dynmo_db.storeDataToiDb import (
    create_user,
    get_post,
    get_user_by_email,
    list_posts,
    save_post,
)


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    try:
        body = _request_body(event)
        method = event.get("httpMethod", "POST").upper()
        path = event.get("path", "").rstrip("/")

        if method == "POST" and path.endswith("/auth/register"):
            return _register(body)
        if method == "POST" and path.endswith("/auth/login"):
            return _login(body)
        if method == "POST" and path.endswith("/thoughts"):
            return _create_post(body, event)
        if method == "GET" and path.endswith("/thoughts"):
            return _list_posts(event)
        if method == "GET" and path.endswith("/analysis"):
            return _get_analysis(event)
        return _response(404, {"error": "Route not found"})
    except ValueError as error:
        logger.warning("Invalid request: %s", error)
        return _response(400, {"error": str(error)})
    except Exception:
        logger.exception("Request failed")
        return _response(500, {"error": "Unable to process the request."})


def _register(body):
    email = _required_string(body, "email").lower()
    password = _required_string(body, "password")
    name = _required_string(body, "name")
    if len(password) < 8:
        raise ValueError("password must be at least 8 characters")
    if get_user_by_email(email):
        return _response(409, {"error": "An account already exists for this email."})
    user_id = str(uuid4())
    create_user(user_id, email, _hash_password(password), name)
    return _response(201, {"token": _token(user_id), "user": {"id": user_id, "name": name}})


def _login(body):
    email = _required_string(body, "email").lower()
    password = _required_string(body, "password")
    user = get_user_by_email(email)
    if not user or not _verify_password(password, user["password_hash"]):
        return _response(401, {"error": "Invalid email or password."})
    return _response(200, {"token": _token(user["user_id"]), "user": {"id": user["user_id"], "name": user["name"]}})


def _create_post(body, event):
    user = _authenticated_user(event)
    text = _required_string(body, "thought")
    mode = body.get("mode", "individual")
    if mode not in {"individual", "collaborative"}:
        raise ValueError("mode must be individual or collaborative")
    classification = classify_thought(text)
    post = save_post(text, user["user_id"], user["name"], mode, classification)
    return _response(201, {"post": _public_post(post)})


def _list_posts(event):
    _authenticated_user(event)
    params = event.get("queryStringParameters") or {}
    category = _required_query(params, "category")
    subcategory = _required_query(params, "subcategory")
    posts, next_cursor = list_posts(
        category,
        subcategory,
        params.get("limit", 10),
        _decode_cursor(params.get("cursor")),
    )
    payload = {"posts": [_public_post(post) for post in posts]}
    if next_cursor:
        payload["nextCursor"] = _encode_cursor(next_cursor)
    return _response(200, payload)


def _get_analysis(event):
    _authenticated_user(event)
    path_parameters = event.get("pathParameters") or {}
    post_id = path_parameters.get("postId") or (event.get("queryStringParameters") or {}).get("postId")
    if not post_id:
        raise ValueError("postId is required")
    post = get_post(post_id)
    if not post:
        return _response(404, {"error": "Post not found"})
    return _response(200, {"analysis": analyze_thought(post["text"])})


def _authenticated_user(event):
    headers = event.get("headers") or {}
    authorization = next(
        (
            value
            for name, value in headers.items()
            if name.lower() == "authorization"
        ),
        "",
    )
    if not authorization.startswith("Bearer "):
        raise ValueError("Authentication is required")
    parts = authorization[7:].split(".")
    if len(parts) != 2 or not hmac.compare_digest(parts[1], _sign(parts[0])):
        raise ValueError("Invalid authentication token")
    return {"user_id": parts[0], "name": "User"}


def _request_body(event):
    body = event.get("body")
    if body is None:
        return {}
    if event.get("isBase64Encoded") and isinstance(body, str):
        body = base64.b64decode(body).decode("utf-8")
    if isinstance(body, str):
        body = json.loads(body)
    if not isinstance(body, dict):
        raise ValueError("Request body must be an object")
    return body


def _required_string(body, field):
    value = body.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} is required")
    return value.strip()


def _required_query(params, field):
    if not params.get(field):
        raise ValueError(f"{field} is required")
    return params[field]


def _public_post(post):
    return {
        "id": post["post_id"],
        "thought": post["text"],
        "author": post["author_name"],
        "mode": post["mode"],
        "category": post["category"],
        "subcategory": post["subcategory"],
        "tags": post["tags"],
        "createdAt": post["created_at"],
        "thoughts": int(post.get("thought_count", 0)),
    }


def _hash_password(password):
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120000)
    return f"{base64.urlsafe_b64encode(salt).decode()}:{base64.urlsafe_b64encode(digest).decode()}"


def _verify_password(password, encoded):
    salt_text, digest_text = encoded.split(":", 1)
    salt = base64.urlsafe_b64decode(salt_text.encode())
    expected = base64.urlsafe_b64decode(digest_text.encode())
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120000)
    return hmac.compare_digest(actual, expected)


def _token(user_id):
    return f"{user_id}.{_sign(user_id)}"


def _sign(value):
    return hmac.new(os.environ["AUTH_SECRET"].encode(), value.encode(), hashlib.sha256).hexdigest()


def _encode_cursor(cursor):
    return base64.urlsafe_b64encode(json.dumps(cursor).encode()).decode()


def _decode_cursor(value):
    if not value:
        return None
    return json.loads(base64.urlsafe_b64decode(value.encode()).decode())


def _response(status_code, payload):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        "body": json.dumps(payload),
    }
