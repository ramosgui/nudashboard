from pymongo import MongoClient


def mongo_connection():
    client = MongoClient("mongodb://localhost:27017/")
    return client['nudashboard']
