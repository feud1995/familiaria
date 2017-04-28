from flask import Flask, render_template, url_for
import socketio

sio = socketio.Server(logger=True)
app = Flask(__name__)
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/')
def index():
    """ Main familiaria website """
    return render_template('index.html')

@app.route('/button')
def button_debug():
    """ Debugger for testing websocket sent signals from RPi buttons
        (for now simulated in in browser)
    """
    return render_template('button_debug.html')


@sio.on('connect')
def connect(sid, environ):
    sio.enter_room(sid, 'familiaria', namespace = '/input')

@sio.on('key pressed', namespace='/test')
def test_message(sid, message):
    sio.emit('my response', {'data': message['data']}, room=sid,
             namespace='/input')

@sio.on('button pressed', namespace = '/rpi')
def button_pressed(sid, button):
    sio.emit('button pressed', {'data': button['data']}, namespace = '/input', room='familiaria')


if __name__ == '__main__':
    import eventlet
    import eventlet.wsgi
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
