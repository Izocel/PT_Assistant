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
    print('received message:\n' + data)
    send("SERVER: awnser.....")
    
@socketio.on('json')
def handle_json(json):
    print('received json:\n' + str(json))
    send(json, json=True)
    
@socketio.on('stream')
def handle_stream(data):
    print('received stream:\n' + str(json))
    emit('my response', data, broadcast=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    socketio.run(app)