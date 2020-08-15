from datetime import datetime

from application.transactions.model import TransactionModel
from config import MongoDatabaseConfig


class TransactionRepository:

    def __init__(self, mongodb: MongoDatabaseConfig):
        self._transaction_collection = mongodb.card_transactions_collections
        self._category_mapping_collection = mongodb.category_mapping_collection
        self._title_mapping_collection = mongodb.title_mapping_collection

    def _create_transaction_model(self, raw_trx: dict):
        trx_model = TransactionModel(id_=raw_trx['_id'], post_date=raw_trx['post_date'], raw_title=raw_trx['title'],
                                     raw_category=raw_trx['category'], amount=raw_trx['amount'],
                                     charges=raw_trx.get('charges'), ref_id=raw_trx.get('ref_id'),
                                     category_map_collection=self._category_mapping_collection,
                                     title_mapping_collection=self._title_mapping_collection,
                                     index=raw_trx.get('index'), type_=raw_trx['type'])
        return trx_model

    def get_transaction(self, trx_id: str) -> TransactionModel:
        trx = self._transaction_collection.find_one({'_id': trx_id})
        return self._create_transaction_model(trx)

    def get_transactions(self, start_date: datetime, end_date: datetime):
        filters_ = {
            'post_date': {'$gte': start_date, '$lte': end_date}
        }
        result = self._transaction_collection.find(filters_).sort([('post_date', -1), ('charges', 1)])

        transactions = []
        for trx in result:
            transactions.append(self._create_transaction_model(trx))

        return transactions

    def get_trx_amount_by_categories(self, start_date: datetime, end_date: datetime):
        transactions = self.get_transactions(start_date=start_date, end_date=end_date)
        amount_by_category = {}
        for transaction in transactions:
            if transaction.raw_category in ('TransferInEvent'):
                continue
            value = amount_by_category.get(transaction.category, 0) + transaction.amount
            amount_by_category[transaction.category] = float('%.2f' % value)

        return amount_by_category

# todo em cada preço colocar icone indicando se o gasto é maior ou menor do que os mesmos da categoria
# todo possivel alterar o title de todas as parcelas
# todo talvez juntar as transações da msm compra (parcelas)