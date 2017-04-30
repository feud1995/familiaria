import RPi.GPIO as GPIO
from time import sleep
from socketIO_client import SocketIO, BaseNamespace
from config import HOST, PORT, RPiConfig

sio = SocketIO(HOST, PORT)
ispace = sio.define(BaseNamespace, '/input')

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

try:
    GPIO.setup([RPiConfig.LEFT_BUTTON_PIN, RPiConfig.RIGHT_BUTTON_PIN], GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup([RPiConfig.LEFT_DIOD_PIN, RPiConfig.RIGHT_DIOD_PIN], GPIO.OUT, initial = GPIO.LOW)
    while True:
        if GPIO.input(RPiConfig.LEFT_BUTTON_PIN):
            GPIO.output(RPiConfig.LEFT_DIOD_PIN, GPIO.HIGH)
            ispace.emit('button pressed', {'data': '1'})
            sleep(RPiConfig.DIOD_TIMEOUT)
            GPIO.output(RPiConfig.LEFT_DIOD_PIN, GPIO.LOW)
        if GPIO.input(RPiConfig.RIGHT_BUTTON_PIN):
            GPIO.output(RPiConfig.RIGHT_DIOD_PIN, GPIO.HIGH)
            ispace.emit('button pressed', {'data': '2'})
            sleep(RPiConfig.DIOD_TIMEOUT)
            GPIO.output(RPiConfig.RIGHT_DIOD_PIN, GPIO.LOW)
        sleep(0.05)
finally:
    GPIO.cleanup()
