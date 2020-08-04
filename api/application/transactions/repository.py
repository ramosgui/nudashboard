from datetime import datetime

from application.transactions.model import TransactionModel
from config import MongoDatabaseConfig


class TransactionRepository:

    def __init__(self, mongodb: MongoDatabaseConfig):
        self._transaction_collection = mongodb.card_transactions_collections
        self._title_ref_mapping_collection = mongodb.title_ref_mapping_collection
        self._category_mapping_collection = mongodb.category_mapping_collection
        self._title_mapping_collection = mongodb.title_mapping_collection

    def _get_title_by_map(self, raw_title: str):
        title = self._title_mapping_collection.find_one({'_id': raw_title})
        if title:
            return title['title']

    def _get_category_by_map(self, raw_category: str, title_by_id: str, raw_title: str, title_by_map: str,
                             title_by_ref: str):
        category = self._category_mapping_collection.find_one({'_id': raw_category})
        category_by_map_trx = self._category_mapping_collection.find_one({'_id': title_by_map})
        category_by_id_trx = self._category_mapping_collection.find_one({'_id': title_by_id})
        category_by_raw_trx = self._category_mapping_collection.find_one({'_id': raw_title})
        category_by_ref_trx = self._category_mapping_collection.find_one({'_id': title_by_ref})
        if category_by_id_trx:
            return category_by_id_trx['category']
        elif category_by_ref_trx:
            return category_by_ref_trx['category']
        elif category_by_map_trx:
            return category_by_map_trx['category']
        elif category_by_raw_trx:
            return category_by_raw_trx['category']
        elif category:
            return category['category']

    def _get_title_by_ref_id(self, ref_id: str):
        if ref_id:
            title = self._title_ref_mapping_collection.find_one({'_id': ref_id})
            if title:
                return title['title']

    def _create_transaction_model(self, raw_trx: dict):
        raw_title = raw_trx['title']
        title_by_id = raw_trx.get('new_title')
        title_by_map = self._get_title_by_map(raw_title=raw_title)
        title_by_ref = self._get_title_by_ref_id(ref_id=raw_trx.get('ref_id'))

        raw_category = raw_trx['category']
        category_by_id = raw_trx.get('new_category')
        category_by_map = self._get_category_by_map(raw_category=raw_category, raw_title=raw_title,
                                                    title_by_map=title_by_map, title_by_ref=title_by_ref,
                                                    title_by_id=title_by_id)

        if raw_trx.get('charges', 0) <= 1:
            charges = None
            charges_paid = None
        else:
            charges = raw_trx['charges']
            charges_paid = raw_trx['index'] + 1

        trx_model = TransactionModel(id_=raw_trx['_id'], post_date=raw_trx['post_date'], raw_title=raw_title,
                                     title_by_id=title_by_id, title_by_map=title_by_map,
                                     raw_category=raw_category, category_by_id=category_by_id,
                                     category_by_map=category_by_map, amount=raw_trx['amount'],
                                     charges_paid=charges_paid, charges=charges, ref_id=raw_trx.get('ref_id'),
                                     title_by_ref=title_by_ref, transactions_collection=self._transaction_collection,
                                     category_map_collection=self._category_mapping_collection)
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
            if trx['title'] == 'Pagamento recebido':
                continue
            transactions.append(self._create_transaction_model(trx))

        return transactions

    def get_amount_by_category(self):
        transactions = self.get_transactions(start_date=datetime(2020, 1, 1), end_date=datetime(2020, 10, 1))
        amount_by_category_list = []
        amount_by_category = {}
        for transaction in transactions:
            value = amount_by_category.get(transaction.category, 0) + transaction.amount
            amount_by_category[transaction.category] = value

        for k, v in amount_by_category.items():
            amount_by_category_list.append({'category': k, 'value': float('%.2f' % v)})

        return amount_by_category_list





# todo em cada preço colocar icone indicando se o gasto é maior ou menor do que os mesmos da categoria
# todo possivel alterar o title de todas as parcelas
# todo talvez juntar as transações da msm compra (parcelas)