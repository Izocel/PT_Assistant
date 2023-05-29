import json
from flask import Flask, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
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


ALLOWED_HOSTS= '*'

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins=ALLOWED_HOSTS)

@app.route("/")
def index():
    return jsonify({'name': 'alice',
                'email': 'alice@outlook.com'})

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    send("SERVER: xxxxxxxxxxxxxxx")
    
@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))
    send(json, json=True)
    
@socketio.on('my event')
def handle_my_custom_event(json):
    emit('my response', json)

if __name__ == '__main__':
    socketio.run(app)