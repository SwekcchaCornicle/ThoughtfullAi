#!/usr/bin/env python3

import json
from pathlib import Path

import aws_cdk as cdk

from thoughtfull.thoughtfull_stack import ThoughtfullStack


app = cdk.App()
env_config_path = Path(__file__).parent / "env_config.json"
with env_config_path.open(encoding="utf-8") as env_config_file:
    env_config = json.load(env_config_file)

ThoughtfullStack(
    app,
    "ThoughtfullStack",
    env=cdk.Environment(
        account=env_config["account_no"],
        region=env_config["region"]
    ),
)

app.synth()