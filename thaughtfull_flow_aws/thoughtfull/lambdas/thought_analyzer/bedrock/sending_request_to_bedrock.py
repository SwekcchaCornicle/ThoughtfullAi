import json
import logging
import os

import boto3


bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def classify_thought(thought: str):
    """Return only routing metadata used to place a post in Explore."""
    classification = _invoke_json(
        thought,
        """
You classify a community thought for navigation. Return only valid JSON with
exactly these keys: category, subcategory, tags.
category must be one of: Game, Tech, Living, Poetry, Health.
subcategory must be one of: Game Design, Esports, Gaming Culture,
Game Development, AI, AWS, Cloud, Software, Cybersecurity, Work, Lifestyle,
Relationships, Personal Growth, Creative Writing, Literature, Expression,
Storytelling, Fitness, Nutrition, Wellness, Healthy Living.
Choose the closest matching category and subcategory. tags must be an array of
short strings. Do not return a summary, explanation, or Markdown.
""",
        max_tokens=250,
    )
    expected_keys = {"category", "subcategory", "tags"}
    _validate_shape(classification, expected_keys, {"category", "subcategory"})
    return classification


def analyze_thought(thought: str):
    """Return detailed AI analysis only when the user explicitly requests it."""
    analysis = _invoke_json(
        thought,
        """
You are ThoughtSpace AI. Analyze the user's thought and return only valid JSON
with exactly these keys: category, subcategory, intent, summary,
discussion_type, and tags. All values except tags are strings and tags is an
array of strings. Do not return Markdown or any text outside the JSON.
""",
        max_tokens=500,
    )
    expected_keys = {
        "category", "subcategory", "intent", "summary", "discussion_type", "tags"
    }
    _validate_shape(
        analysis,
        expected_keys,
        expected_keys - {"tags"},
    )
    return analysis


def _invoke_json(thought, system_prompt, max_tokens):
    logger.info("Bedrock request started")
    response = bedrock.converse(
        modelId=os.environ["BEDROCK_MODEL_ID"],
        system=[{"text": system_prompt}],
        messages=[{
            "role": "user",
            "content": [{"text": f"User thought:\n\n{thought}"}],
        }],
        inferenceConfig={"maxTokens": max_tokens, "temperature": 0.2},
    )
    raw_response = response["output"]["message"]["content"][0]["text"]
    normalized_response = raw_response.strip()
    if normalized_response.startswith("```"):
        normalized_response = normalized_response.split("\n", 1)[-1]
        normalized_response = normalized_response.rsplit("```", 1)[0].strip()
    try:
        parsed_response = json.loads(normalized_response)
    except json.JSONDecodeError as error:
        start = normalized_response.find("{")
        end = normalized_response.rfind("}")
        if start < 0 or end <= start:
            raise ValueError("Bedrock returned invalid JSON") from error
        try:
            parsed_response = json.loads(normalized_response[start : end + 1])
        except json.JSONDecodeError as nested_error:
            raise ValueError("Bedrock returned invalid JSON") from nested_error
    logger.info("Bedrock response parsed successfully")
    return parsed_response


def _validate_shape(value, expected_keys, string_fields):
    if not isinstance(value, dict) or set(value) != expected_keys:
        raise ValueError("Bedrock returned an unexpected analysis shape")
    if not all(isinstance(value[field], str) for field in string_fields):
        raise ValueError("Bedrock text fields must be strings")
    if not isinstance(value["tags"], list) or not all(
        isinstance(tag, str) for tag in value["tags"]
    ):
        raise ValueError("Bedrock tags must be an array of strings")