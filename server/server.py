import json
from flask import Flask, jsonify
import sentry_sdk

from dotenv import dotenv_values
config = dotenv_values(".env")

if config["sentry_env"] == 'production':
    sentry_sdk.init(
        dsn=config["sentry_dsn"],
        environment=config["sentry_env"],
        release=config["version"],
        traces_sample_rate=1.0
    )


app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({'name': 'alice',
                'email': 'alice@outlook.com'})
