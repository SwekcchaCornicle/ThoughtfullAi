from pathlib import Path

import os

from aws_cdk import (
    Stack,
    Duration,
    CfnOutput,
    aws_iam as iam,
    aws_s3 as s3,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    aws_logs as logs,
)

from constructs import Construct


LAMBDA_ASSET_PATH = str(
    Path(__file__).parent / "lambdas" / "thought_analyzer"
)


class ThoughtfullStack(Stack):

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        **kwargs
    ) -> None:

        super().__init__(
            scope,
            construct_id,
            **kwargs
        )

        # ============================================
        # S3 BUCKET
        # ============================================

        thoughtfull_bucket = s3.Bucket(
            self,
            "ThoughtfullS3Bucket",

            # Let AWS/CDK generate a unique bucket name
            # instead of hardcoding one.
            enforce_ssl=True,

        )


        # ============================================
        # CLOUDWATCH LOG GROUP
        # ============================================

        log_group = logs.LogGroup(
            self,
            "ThoughtfullLambdaLogGroup",

            retention=logs.RetentionDays.ONE_MONTH,
        )


        # ============================================
        # IAM ROLE FOR LAMBDA
        # ============================================

        lambda_role = iam.Role(
            self,
            "ThoughtfullLambdaRole",

            assumed_by=iam.ServicePrincipal(
                "lambda.amazonaws.com"
            ),
        )


        # ============================================
        # LAMBDA
        # ============================================

        thought_lambda = _lambda.Function(
            self,
            "ThoughtAnalyzerLambda",

            function_name="thought_analyzer",

            runtime=_lambda.Runtime.PYTHON_3_12,

            handler="thought_analyzer.lambda_handler",

            code=_lambda.Code.from_asset(
                LAMBDA_ASSET_PATH
            ),

            timeout=Duration.seconds(30),

            role=lambda_role,

            log_group=log_group,

            environment={
                "S3_BUCKET_NAME":
                    thoughtfull_bucket.bucket_name,
                "BEDROCK_MODEL_ID":
                    os.getenv("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0"),
            },
        )


        # ============================================
        # S3 PERMISSIONS
        # ============================================

        thoughtfull_bucket.grant_read_write(
            thought_lambda
        )

        thought_lambda.add_to_role_policy(
            iam.PolicyStatement(
                actions=["bedrock:InvokeModel"],
                resources=["*"],
            )
        )


        # ============================================
        # API GATEWAY
        # ============================================

        api = apigateway.RestApi(
            self,
            "ThoughtfullRestApi",

            rest_api_name="thoughtfull-api",

            default_cors_preflight_options=
                apigateway.CorsOptions(
                    allow_origins=[
                        "http://localhost:5173"
                    ],

                    allow_methods=[
                        "POST",
                        "OPTIONS"
                    ],

                    allow_headers=[
                        "Content-Type"
                    ],
                ),
        )


        # ============================================
        # POST /thoughts
        # ============================================

        thoughts_resource = api.root.add_resource(
            "thoughts"
        )

        thoughts_resource.add_method(
            "POST",
            apigateway.LambdaIntegration(
                thought_lambda
            ),
        )


        # ============================================
        # OUTPUTS
        # ============================================

        CfnOutput(
            self,
            "ApiUrl",

            value=api.url,
        )

        CfnOutput(
            self,
            "S3BucketName",

            value=thoughtfull_bucket.bucket_name,
        )

        CfnOutput(
            self,
            "LogGroupName",

            value=log_group.log_group_name,
        )


