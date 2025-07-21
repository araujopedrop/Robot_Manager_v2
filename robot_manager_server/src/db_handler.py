from pymongo import MongoClient

class DbHandler():

    mongo_url = "mongodb://localhost:27017"
    database = "robot_manager"
    map_collection_name = "mapas"
    robot_collection_name = "robots"

    def __init__(self):
        # Get database info
        self.client = MongoClient(self.mongo_url)
        self.db     = self.client[self.database]

        self.map_collection = self.db[self.map_collection_name]
        self.robot_collection = self.db[self.robot_collection_name]


