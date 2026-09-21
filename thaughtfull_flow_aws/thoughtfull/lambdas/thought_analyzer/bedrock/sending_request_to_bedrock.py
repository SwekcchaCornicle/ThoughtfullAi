import os

import boto3


bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
)


def analyze_thought(thought: str):
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

    return response["output"]["message"]["content"][0]["text"]