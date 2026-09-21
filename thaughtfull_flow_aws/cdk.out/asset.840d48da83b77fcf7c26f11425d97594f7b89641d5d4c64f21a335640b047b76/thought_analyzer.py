import base64
import json

from bedrock.sending_request_to_bedrock import analyze_thought


def lambda_handler(event, context):
	body = event.get("body", event)

	if event.get("isBase64Encoded") and isinstance(body, str):
		body = base64.b64decode(body).decode("utf-8")

	if isinstance(body, str):
		body = json.loads(body)

	thought = body.get("thought") if isinstance(body, dict) else None
	if not thought or not isinstance(thought, str):
		return {
			"statusCode": 400,
			"headers": {"Content-Type": "application/json"},
			"body": json.dumps({"error": "thought is required"}),
		}

	analysis = analyze_thought(thought)
	return {
		"statusCode": 200,
		"headers": {"Content-Type": "application/json"},
		"body": json.dumps({"analysis": analysis}),
	}
