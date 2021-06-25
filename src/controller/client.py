import socket
import json

# This class should only handle incoming traffic. Moving this code into a different class feels 
# like overkill at the moment. however if this process commands keeps growing further a separate
# parser is required
class Client:
    
    def __init__(self, connection, controller):
        self.connection = connection
        self.controller = controller
    
    def process_commands(self):
        try:
            while True:
                data = self.connection.recv(512)
                print ("received: \n----\n{0}\n------".format(data))
                if data:
                    stringData = data.decode('utf-8')

                    # messages are verified in the parse method. we can directly get to work 
                    for message in self.__parse_incoming(stringData):
                        
                        # Find out what the client wanted and honorate it
                        if message['type'] == "sync_position":
                            self.__send_message("sync_position", self.controller.currentPosition())
                        elif message['type'] == "target_position":
                            self.controller.adjust(message['value'], self)
                        else:
                            self.__send_message("unknown_type", message['type'])

                else:
                    print ("no more data from client")
                    self.connection.close()
                    break
        except ValueError:
            print("Invalid json received. Ignoring the message")
        except:
            print("Unkonwn error (certainly not a value error)")
            self.connection.close()
    
    # This method parses the incoming data blob. first a split is done on newline, then it is checked whether the part is a 
    # json. If it is and the request message is a new target position we put it in a buffer, we only want the last update 
    # to apply (to handle sticky user fingers). Non target updates are just passed through
    def __parse_incoming(self, stringData):
        messages = []
        
        last_target_position = ""
        for stringDataPart in stringData.split('\n'):
            if stringDataPart == "":
                continue
            try:
                message = json.loads(stringDataPart)
                if message['type'] == "target_position":
                    last_target_position = message
                else:
                    messages.append(message)
            except ValueError:
                print("Invalid json received '{0}'. Ignoring the message".format(message))
                continue

        if last_target_position != "":
            messages.append(last_target_position)
        
        return messages

    def __send_message(self, type, data):
        message = {
           'type': type,
           'value': data 
        }
        self.connection.sendall(json.dumps(message))

    def adjustment_callback(self, currentPosition):
        print ("updated position to {0}%".format(currentPosition))
        self.__send_message("new_position", currentPosition)
        