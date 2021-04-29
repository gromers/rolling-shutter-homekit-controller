import constants
import sqlite3
from sqlite3 import Error

# Does the persisting of the current state
class PositionRepository:

    def __init__(self):
        self.currentPosition = -1
        self.currentPosition = self.read()

    def read(self):
        if self.currentPosition == -1:
            return 100
        else:
            return self.currentPosition

    def write(self, position):
        self.currentPosition = position
        return True

    # The idea is to do the persistion towards the database. 
    #
    # def write(self):
    #     conn = None
    #     try:
    #         conn = sqlite3.connect(self.databasePath)
    #         print(sqlite3.version)
    #     except Error as e:
    #         print(e)
    #     finally:
    #         if conn:
    #             conn.close()
