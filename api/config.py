from pymongo import MongoClient
from pymongo.collection import Collection


class MongoDatabaseConfig:

    def __init__(self, card_transactions_collections: Collection, debit_transactions_collections: Collection,
                 category_mapping_collection: Collection, title_mapping_collection: Collection,
                 title_ref_mapping_collection: Collection):
        """

        :param card_transactions_collections:
        :param debit_transactions_collections:
        :param category_mapping_collection:
        :param title_mapping_collection:
        :param title_ref_mapping_collection:
        """
        self.card_transactions_collections = card_transactions_collections
        self.debit_transactions_collections = debit_transactions_collections
        self.category_mapping_collection = category_mapping_collection
        self.title_mapping_collection = title_mapping_collection
        self.title_ref_mapping_collection = title_ref_mapping_collection


class Config:

    def __init__(self, mongodb: MongoDatabaseConfig):
        self.mongodb = mongodb


def mongo_database():
    client = MongoClient()
    db = client['nudashboard']
    card_transactions_collection = db['card_transactions']
    debit_transactions_collection = db['debit_transactions']
    category_mapping_collection = db['category_mapping']
    title_ref_mapping_collection = db['title_ref_mapping']
    title_mapping_collection = db['title_mapping']

    return MongoDatabaseConfig(card_transactions_collections=card_transactions_collection,
                               debit_transactions_collections=debit_transactions_collection,
                               category_mapping_collection=category_mapping_collection,
                               title_mapping_collection=title_mapping_collection,
                               title_ref_mapping_collection=title_ref_mapping_collection)


def create_config():
    mongodb = mongo_database()
    return Config(mongodb=mongodb)
