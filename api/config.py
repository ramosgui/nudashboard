from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from application.categories.repository import CategoriesRepository
from application.categories.service import CategoriesService
from application.transactions.repository import TransactionRepository
from application.transactions.service import TransactionService


class MongoDatabaseConfig:

    def __init__(self, card_transactions_collections: Collection, debit_transactions_collections: Collection,
                 category_mapping_collection: Collection, title_mapping_collection: Collection,
                 current_bill_info_collection: Collection, categories_collection: Collection,
                 fixed_transaction_collection: Collection, mongodb_connection: Database):
        """

        :param card_transactions_collections:
        :param debit_transactions_collections:
        :param category_mapping_collection:
        :param title_mapping_collection:
        :param current_bill_info_collection:
        :param categories_collection:
        :param fixed_transaction_collection:
        """
        self.card_transactions_collections = card_transactions_collections
        self.debit_transactions_collections = debit_transactions_collections
        self.category_mapping_collection = category_mapping_collection
        self.title_mapping_collection = title_mapping_collection
        self.current_bill_info_collection = current_bill_info_collection
        self.categories_collection = categories_collection
        self.fixed_transaction_collection = fixed_transaction_collection
        self.database = mongodb_connection


class Config:

    def __init__(self, mongodb: MongoDatabaseConfig):
        transaction_repository = TransactionRepository(mongodb=mongodb)
        categories_repository = CategoriesRepository(mongodb=mongodb.database)

        self.transaction_service = TransactionService(transactions_repository=transaction_repository,
                                                      categories_repository=categories_repository)
        self.categories_service = CategoriesService(categories_repository=categories_repository)

        self.mongodb = mongodb


def mongo_database(mongo_config: dict):
    client = MongoClient(host=mongo_config['host'], port=mongo_config['port'])
    db = client['nudashboard']
    card_transactions_collection = db['card_transactions']
    debit_transactions_collection = db['debit_transactions']
    category_mapping_collection = db['category_mapping']
    title_mapping_collection = db['title_mapping']
    current_bill_info_collection = db['current_bill_info']
    categories_collection = db['categories']
    fixed_transaction_collection = db['fixed_transactions']

    return MongoDatabaseConfig(card_transactions_collections=card_transactions_collection,
                               debit_transactions_collections=debit_transactions_collection,
                               category_mapping_collection=category_mapping_collection,
                               title_mapping_collection=title_mapping_collection,
                               current_bill_info_collection=current_bill_info_collection,
                               categories_collection=categories_collection,
                               fixed_transaction_collection=fixed_transaction_collection,
                               mongodb_connection=db)


def create_config(config_file: dict):
    mongodb = mongo_database(config_file['mongodb'])
    return Config(mongodb=mongodb)
