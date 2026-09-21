import os
import logging

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
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": f"""
Analyze this ThoughtFlow discussion:

{thought}

Return:
- category
- subcategory
- intent
- summary
- discussion_type
- tags
"""
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
    return analysis