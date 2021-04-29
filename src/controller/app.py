import constants

from controller import Controller
from server import Server
from client import Client
from position import PositionRepository

class App:

    def __init__(self):
        self.__boot()
        self.server.start_listening()

    def __boot(self):
        self.positionRepository = PositionRepository()
        self.controller = Controller(self.positionRepository)
        self.server = Server(self)

    # We can safely assume that there is only one client (which is the plugin that interfaces 
    # with the homekit client) 
    def handle(self, connection):
        self.client = Client(connection, self.controller)
        self.client.process_commands()

def __print_configuration():
    print("")
    print("Direction Relay should be connected to PIN  : {0}".format(constants.PIN_DIRECTION_RELAY))
    print("Power Relay should be connected to PIN      : {0}".format(constants.PIN_POWER_RELAY))
    print("Shutting duration in seconds                : {0}".format(constants.SHUTTING_DURATION_IN_SECONDS))
    print("")

if __name__ == '__main__':
    __print_configuration()
    app = App()
