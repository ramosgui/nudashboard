from datetime import datetime, timedelta
from typing import List

from dateutil.relativedelta import relativedelta

from application.transactions.model import TransactionModel
from config import MongoDatabaseConfig


class TransactionRepository:

    def __init__(self, mongodb: MongoDatabaseConfig):
        self._transaction_collection = mongodb.card_transactions_collections
        self._category_mapping_collection = mongodb.category_mapping_collection
        self._title_mapping_collection = mongodb.title_mapping_collection
        self._current_bill_info_collection = mongodb.current_bill_info_collection
        self._fixed_transaction_collection = mongodb.fixed_transaction_collection

    def _create_transaction_model(self, raw_trx: dict):
        trx_model = TransactionModel(id_=raw_trx['_id'], post_date=raw_trx['post_date'], raw_title=raw_trx['title'],
                                     raw_category=raw_trx['category'], amount=raw_trx['amount'],
                                     charges=raw_trx.get('charges'), ref_id=raw_trx.get('ref_id'),
                                     category_map_collection=self._category_mapping_collection,
                                     title_mapping_collection=self._title_mapping_collection,
                                     fixed_transaction_collection=self._fixed_transaction_collection,
                                     index=raw_trx.get('index'), type_=raw_trx['type'])

        # necessário para preencher os campos (mudar futuramente)
        a = trx_model.category

        same_category_check = None
        if trx_model.category_by_trx_name and not trx_model.category_by_trx_id:
            same_category_check = True

        trx_model.same_category_check = same_category_check

        same_name_check = None
        if trx_model.title_by_name and not trx_model.title_by_id:
            same_name_check = True

        trx_model.same_name_check = same_name_check

        return trx_model

    def get_transaction(self, trx_id: str) -> TransactionModel:
        trx = self._transaction_collection.find_one({'_id': trx_id})
        if trx:
            return self._create_transaction_model(trx)

    def get_transactions(self, start_date: datetime, end_date: datetime, custom_filters: dict = None):
        filters_ = {
            'post_date': {'$gte': start_date, '$lte': end_date}
        }

        if custom_filters:
            filters_.update(custom_filters)

        result = self._transaction_collection.find(filters_).sort([('post_date', -1), ('charges', 1)])

        transactions = []
        for trx in result:
            transactions.append(self._create_transaction_model(trx))

        return transactions

    def get_fixed_transactions_new(self):
        transactions = []
        result = self._fixed_transaction_collection.find({})
        for trx in result:
            transactions.append(trx['_id'])
        return transactions

    def get_transactions_by_name(self, name: str):
        transactions = []
        trx_ids = []
        for trx in self._title_mapping_collection.find({'value': name}):
            trx_ids.append(trx['_id'])

        trxs_by_id = self._transaction_collection.find({'_id': {'$in': trx_ids}})
        for trx_id in trxs_by_id:
            transactions.append(self._create_transaction_model(trx_id))

        trxs_by_name = self._transaction_collection.find({'title': {'$in': trx_ids}})
        for trx_name in trxs_by_name:
            transactions.append(self._create_transaction_model(trx_name))

        return transactions

    def get_future_transactions(self):
        end_date = datetime.utcnow()
        start_date = end_date - relativedelta(months=1)

        future_transactions = []
        ref_control = {}

        transactions = self.get_transactions(start_date, end_date)
        for trx in transactions:
            if trx.index is not None:
                if trx.ref_id not in ref_control:
                    ref_control[trx.ref_id] = trx

                    formatted_index = trx.index+1
                    if formatted_index < trx.charges:
                        trx.index = formatted_index
                        trx.time = trx.time + relativedelta(months=1)
                        future_transactions.append(trx)

                else:
                    saved = ref_control[trx.ref_id]
                    if trx.index > saved.index:
                        raise ValueError('Algo errado nao esta certo')

        return future_transactions

    def get_trx_amount_by_categories(self, start_date: datetime, end_date: datetime):
        transactions = self.get_transactions(start_date=start_date, end_date=end_date)
        amount_by_category = {}
        for transaction in transactions:
            if transaction.raw_category in ('TransferInEvent'):
                continue
            value = amount_by_category.get(transaction.category, 0) + transaction.amount
            amount_by_category[transaction.category] = float('%.2f' % value)

        return amount_by_category

    def get_positive_account_transactions(self, start_date: datetime, end_date: datetime):
        transactions = self.get_transactions(start_date=start_date, end_date=end_date,
                                             custom_filters={'category': 'TransferInEvent'})

        return transactions

    def get_negative_account_transactions(self, start_date: datetime, end_date: datetime):
        transactions = self.get_transactions(start_date=start_date, end_date=end_date,
                                             custom_filters={'category': {'$in': ['BarcodePaymentEvent',
                                                                                  'TransferOutEvent']}})
        return transactions

    def get_bill_amount(self, bill: str):
        result = self._current_bill_info_collection.find_one({'_id': bill})
        if result:
            return result.get('total_balance', 0)/100, result['state']
        return 0, None

    def get_account_amount(self):
        total = self._current_bill_info_collection.find_one({'_id': 'account_balance'})
        return total

    def get_fixed_transactions(self, start_date: datetime, end_date: datetime) -> List[TransactionModel]:
        transactions = self.get_transactions(start_date=start_date, end_date=end_date, custom_filters={'fixed': True})
        return transactions


# todo em cada preço colocar icone indicando se o gasto é maior ou menor do que os mesmos da categoria
# todo possivel alterar o title de todas as parcelas
# todo talvez juntar as transações da msm compra (parcelas)
