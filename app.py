from flask import Flask, render_template, url_for, jsonify
import socketio
from config import PORT, HOST
# uncomment to load questions from questions.py file
# from questions import QUESTIONS

sio = socketio.Server(logger=True)
app = Flask(__name__)
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)
app.config.from_object('config.FlaskConfig')

@app.route('/')
def index():
    """ Main familiaria website """
    return render_template('index.html')

@app.route('/get_questions')
def get_questions():
    """ Returns questions json """
    # one can also jsonify it from anywhere like database
    # return jsonify(QUESTIONS)
    return render_template('questions.json')

@app.route('/button')
def button_debug():
    """ Debugger for testing websocket sent signals from RPi buttons
        (for now simulated in in browser)
    """
    return render_template('button_debug.html')


@sio.on('connect')
def connect(sid, environ):
    #sio.enter_room(sid, 'familiaria', namespace = '/input')
    pass

@sio.on('key pressed', namespace='/input')
def test_message(sid, message):
    sio.emit('my response', {'data': message['data']}, room=sid,
             namespace='/input')

@sio.on('button pressed', namespace = '/input')
def button_pressed(sid, button):
    BUTTON_MAP = {'1': 'left', '2': 'right'}
    sio.emit('button pressed', {'data': BUTTON_MAP[button['data']]}, namespace = '/input', )#room='familiaria')


if __name__ == '__main__':
    import eventlet
    import eventlet.wsgi
    eventlet.wsgi.server(eventlet.listen((HOST, PORT)), app)
