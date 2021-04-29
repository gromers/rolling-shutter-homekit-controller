# import RPi.GPIO as GPIO

class Relay: 
    def __init__(self, pin, name):
        self.pin = pin
        self.name = name
	    # GPIO.setmode(GPIO.BCM)
	    # GPIO.setup(self.pin, GPIO.OUT)

    def on(self):
        print("{0} ON".format(self.name))
	    # GPIO.output(self.pin, GPIO.HIGH)

    def off(self):
        print("{0} OFF".format(self.name))
	    # GPIO.output(self.pin, GPIO.LOW)
