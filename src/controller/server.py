import socket
import sys
import constants

# This class takes incoming clients and invokes the earlier set callback with the new client. At 
# the moment, only the homekit plugin is our client, so we don't have to care about multi socket.

class Server:

    def __init__(self, callbackHandler):
        self.__callbackHandler = callbackHandler
        self.__createServerSocket()

    def start_listening(self):
        self.socket.listen(1)
        while True:
            print("waiting for a connection..")
            connection, client_address = self.socket.accept()
            print ("connection from {0}".format(client_address))
            if self.__callbackHandler != None:
                self.__callbackHandler.handle(connection)
            else:
                print("callback wasn't set. Stopping the connection..")
                connection.close()

    def __createServerSocket(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_address = ('localhost', constants.TCP_SERVER_PORT)
        self.socket.bind(self.server_address)
