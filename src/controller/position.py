import constants

# Does the persisting of the current state
class PositionRepository:

    def read(self):
        position = -1
        with open('actual.position', 'r') as reader:
            position = int(reader.readline())
        return position

    def write(self, position):
        with open('actual.position', 'w') as writer:
            writer.write("{0}".format(position))
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
