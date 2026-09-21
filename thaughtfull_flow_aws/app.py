#!/usr/bin/env python3

import aws_cdk as cdk

from thoughtfull.thoughtfull_stack import ThoughtfullStack


app = cdk.App()

ThoughtfullStack(
    app,
    "ThoughtfullStack",
    env=cdk.Environment(
        account="630596767812",
        region="ap-south-1"
    ),
)

app.synth()