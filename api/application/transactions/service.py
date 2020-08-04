from datetime import datetime

from application.transactions.repository import TransactionRepository


class TransactionService:

    def __init__(self, transaction_repository: TransactionRepository):
        self._transaction_repository = transaction_repository

    def get_transactions(self):
        start_date = datetime(2020, 1, 1)
        end_date = datetime(2020, 8, 30)
        return self._transaction_repository.get_transactions(start_date=start_date, end_date=end_date)

    def get_amount_by_category(self):
        return self._transaction_repository.get_amount_by_category()
