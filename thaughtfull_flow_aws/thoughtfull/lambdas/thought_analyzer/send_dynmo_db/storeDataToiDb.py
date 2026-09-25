import os
from datetime import datetime, timezone
from uuid import uuid4

import boto3
from boto3.dynamodb.conditions import Attr, Key


dynamodb = boto3.resource("dynamodb")
posts_table = dynamodb.Table(os.environ["POSTS_TABLE_NAME"])
users_table = dynamodb.Table(os.environ["USERS_TABLE_NAME"])


def create_user(user_id, email, password_hash, name):
	users_table.put_item(
		Item={
			"user_id": user_id,
			"email": email,
			"password_hash": password_hash,
			"name": name,
			"created_at": datetime.now(timezone.utc).isoformat(),
		},
		ConditionExpression="attribute_not_exists(user_id)",
	)


def get_user_by_email(email):
	response = users_table.scan(
		FilterExpression=Attr("email").eq(email),
	)
	items = response.get("Items", [])
	return items[0] if items else None


def save_post(text, user_id, author_name, mode, classification):
	created_at = datetime.now(timezone.utc).isoformat()
	post = {
		"post_id": str(uuid4()),
		"text": text,
		"user_id": user_id,
		"author_name": author_name,
		"mode": mode,
		"category": classification["category"],
		"subcategory": classification["subcategory"],
		"category_key": _category_key(
			classification["category"], classification["subcategory"]
		),
		"tags": classification["tags"],
		"created_at": created_at,
		"thought_count": 0,
	}
	posts_table.put_item(Item=post)
	return post


def list_posts(category, subcategory, limit=10, cursor=None):
	query = {
		"IndexName": "CategoryIndex",
		"KeyConditionExpression": Key("category_key").eq(
			_category_key(category, subcategory)
		),
		"ScanIndexForward": False,
		"Limit": min(max(int(limit), 1), 10),
	}
	if cursor:
		query["ExclusiveStartKey"] = cursor

	response = posts_table.query(**query)
	return response.get("Items", []), response.get("LastEvaluatedKey")


def get_post(post_id):
	response = posts_table.get_item(Key={"post_id": post_id})
	return response.get("Item")


def _category_key(category, subcategory):
	return f"{category.strip().lower()}#{subcategory.strip().lower()}"
