import base64
import json
import logging

from bedrock.sending_request_to_bedrock import analyze_thought


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
	logger.info("Lambda invoked")
	logger.info("Received event: %s", json.dumps(event, default=str))

	try:
		body = event.get("body", event)

		if event.get("isBase64Encoded") and isinstance(body, str):
			body = base64.b64decode(body).decode("utf-8")

		if isinstance(body, str):
			body = json.loads(body)
	except (UnicodeDecodeError, ValueError, json.JSONDecodeError):
		logger.exception("Unable to parse the request body")
		return {
			"statusCode": 400,
			"headers": {"Content-Type": "application/json"},
			"body": json.dumps({"error": "Invalid request body"}),
		}
	logger.info("Parsed event body: %s", json.dumps(body, default=str))

	thought = body.get("thought") if isinstance(body, dict) else None
	if not thought or not isinstance(thought, str):
		logger.warning("No valid thought was found in the event")
		return {
			"statusCode": 400,
			"headers": {"Content-Type": "application/json"},
			"body": json.dumps({"error": "thought is required"}),
		}

	logger.info("Sending question to Bedrock")
	try:
		analysis = analyze_thought(thought)
	except Exception:
		logger.exception("Thought analysis failed")
		return {
			"statusCode": 500,
			"headers": {"Content-Type": "application/json"},
			"body": json.dumps({
				"error": "Unable to analyze the thought right now."
			}),
		}
	response = {
		"statusCode": 200,
		"headers": {"Content-Type": "application/json"},
		"body": json.dumps({"analysis": analysis}),
	}
	logger.info("Lambda response: %s", json.dumps(response, default=str))
	return response
