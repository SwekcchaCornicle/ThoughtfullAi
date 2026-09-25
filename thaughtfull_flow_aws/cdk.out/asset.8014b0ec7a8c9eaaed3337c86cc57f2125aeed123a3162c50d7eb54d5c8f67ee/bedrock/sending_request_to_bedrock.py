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


def analyze_thought(thought: str):
    logger.info("Question sent to Bedrock: %s", thought)
    response = bedrock.converse(
        modelId=os.environ["BEDROCK_MODEL_ID"],
        system=[
            {
                "text": """
You are ThoughtFlow AI, the AI classification and analysis engine for ThoughtFlow.

Analyze the user's thought and identify:
1. category
2. subcategory
3. intent
4. summary
5. discussion_type
6. tags

Return only one valid JSON object. Do not return Markdown, code fences, or
explanations outside the JSON. The object must contain exactly these keys:
"category", "subcategory", "intent", "summary", "discussion_type", and
"tags". All values except "tags" must be strings. "tags" must be an array
of strings.

For example, classify this thought as follows:
User thought: Should I learn Kubernetes after AWS?
{
    "category": "Technology",
    "subcategory": "Cloud Computing",
    "intent": "Educational Inquiry",
    "summary": "The user is asking about the learning sequence between AWS and Kubernetes.",
    "discussion_type": "Question",
    "tags": ["AWS", "Kubernetes", "Cloud", "Learning Path"]
}
"""
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": f"User thought:\n\n{thought}"
                    }
                ]
            }
        ],
        inferenceConfig={
            "maxTokens": 500,
            "temperature": 0.2
        }
    )
    logger.info("Raw response from Bedrock: %s", response)

    analysis = response["output"]["message"]["content"][0]["text"]
    logger.info("Bedrock response text: %s", analysis)

    try:
        parsed_analysis = json.loads(analysis)
    except json.JSONDecodeError as error:
        raise ValueError("Bedrock returned invalid JSON") from error

    expected_keys = {
        "category",
        "subcategory",
        "intent",
        "summary",
        "discussion_type",
        "tags",
    }
    if not isinstance(parsed_analysis, dict) or set(parsed_analysis) != expected_keys:
        raise ValueError("Bedrock returned an unexpected analysis shape")

    string_fields = expected_keys - {"tags"}
    if not all(isinstance(parsed_analysis[field], str) for field in string_fields):
        raise ValueError("Bedrock analysis fields must be strings")
    if not isinstance(parsed_analysis["tags"], list) or not all(
        isinstance(tag, str) for tag in parsed_analysis["tags"]
    ):
        raise ValueError("Bedrock tags must be an array of strings")

    return parsed_analysis