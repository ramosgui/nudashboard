from datetime import datetime

from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository


class TransactionService:

    def __init__(self, transaction_repository: TransactionRepository):
        self._transaction_repository = transaction_repository

    def get_transaction(self, trx_id: str) -> TransactionModel:
        """

        :param trx_id:
        :return:
        """
        return self._transaction_repository.get_transaction(trx_id=trx_id)

    def get_transactions(self):
        start_date = datetime(2020, 1, 1)
        end_date = datetime(2020, 8, 30)
        return self._transaction_repository.get_transactions(start_date=start_date, end_date=end_date)

    def get_amount_by_category(self):
        return self._transaction_repository.get_amount_by_category()

    def update_trx_category(self, new_category: str, trx_id: str, type_: str):
        trx = self.get_transaction(trx_id=trx_id)
        trx.category = new_category
        trx.category_type = type_
        trx.save()

    def update_trx_title(self, new_title: str, trx_id: str, type_: str):
        """

        :param new_title:
        :param trx_id:
        :param type_:
        :return:
        """
        trx = self.get_transaction(trx_id=trx_id)
        trx.title = new_title
        trx.title_type = type_
        trx.save()
