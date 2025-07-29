from pymongo import MongoClient

class DbHandler():

    mongo_url = "mongodb://localhost:27017"
    database = "robot_manager"
    map_collection_name = "mapas"
    robot_collection_name = "robots"
    mission_collection_name = "missions"
    waypoint_collection_name = "waypoints"
    user_collection_name = "users"

    def __init__(self):
        # Get database info
        self.client = MongoClient(self.mongo_url)
        self.db     = self.client[self.database]

        self.map_collection = self.db[self.map_collection_name]
        self.robot_collection = self.db[self.robot_collection_name]
        self.mission_collection = self.db[self.mission_collection_name]
        self.waypoint_collection = self.db[self.waypoint_collection_name]
        self.user_collection = self.db[self.user_collection_name]



