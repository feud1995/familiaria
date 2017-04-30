import RPi.GPIO as GPIO
from time import sleep
from socketIO_client import SocketIO, BaseNamespace

sio = SocketIO('192.168.0.30', 5000)
ispace = sio.define(BaseNamespace, '/input')

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

try:
    GPIO.setup([11,12], GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup([7,8], GPIO.OUT, initial = GPIO.LOW)
    while True:
        if GPIO.input(12):
            GPIO.output(8, GPIO.HIGH)
            ispace.emit('button pressed', {'data': '1'})
            sleep(3)
            GPIO.output(8, GPIO.LOW)
        if GPIO.input(11):
            GPIO.output(7, GPIO.HIGH)
            ispace.emit('button pressed', {'data': '2')
            sleep(3)
            GPIO.output(7, GPIO.LOW)
        sleep(0.1)
finally:
    GPIO.cleanup()
