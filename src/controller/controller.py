import constants
import time
from relay import Relay

class Controller:

    def __init__(self, positionRepository):
        self.isAdjusting = False
        self.directionRelay = Relay(constants.PIN_DIRECTION_RELAY, "Directory Relay")
        self.powerRelay = Relay(constants.PIN_POWER_RELAY, "Power Relay")
        self.positionRepository = positionRepository

    def adjust(self, targetPosition, client):

        currentPosition = self.positionRepository.read()

        if self.isAdjusting:
            return # Would be better to throw an error i suppose 
        else:
            self.isAdjusting = True

        shouldOpen = self.__should_open(currentPosition, targetPosition)
        if (shouldOpen == Fasle):
            self.directionRelay.on()
        
        duration = self.__calculate_movement_duration(currentPosition, targetPosition)
        curPos = 0.0 + currentPosition

        self.powerRelay.on()

        while True:
            #  if we reached 0, quit the job. if not, push notif
            if duration <= 0:
                break
            else:
                if client != None:
                    client.adjustment_callback(round(curPos))
            
            # Determine a proper amount to sleep
            toSleep = 0.5
            if (duration < 0.5):
                toSleep = duration

            # wait to keep that relay high
            time.sleep(toSleep)

            # calculate remaining duration
            duration = duration - toSleep
            
            # calculate the new current position
            if (shouldOpen):
                curPos = curPos + (100.0 / (constants.SHUTTING_DURATION_IN_SECONDS / 0.5))
            else:
                curPos = curPos - (100.0 / (constants.SHUTTING_DURATION_IN_SECONDS / 0.5))

        # Turn all relays off
        self.powerRelay.off()
        self.directionRelay.off()

        # make sure the position repo has the last state
        print('writing new position {0}'.format(targetPosition))
        self.positionRepository.write(targetPosition)

        # invoke callback for the interested parties
        client.adjustment_callback(targetPosition)
        self.isAdjusting = False

    def currentPosition(self):
        return self.positionRepository.read()

    def __calculate_movement_duration(self, currentPosition, targetPosition):
        percentualDifference = abs(currentPosition - targetPosition)
        secondByPercent = (constants.SHUTTING_DURATION_IN_SECONDS / 100.0)
        return percentualDifference * secondByPercent

    def __should_open(self, currentPosition, targetPosition):
        return currentPosition < targetPosition
