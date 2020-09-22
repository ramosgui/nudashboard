from datetime import datetime, timedelta

from dateutil.relativedelta import relativedelta

from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository


class TransactionService:

    def __init__(self, transaction_repository: TransactionRepository):
        self._transaction_repository = transaction_repository

    @staticmethod
    def _percentile(number1, number2):
        return (number1 / number2) * 100

    def get_transaction(self, trx_id: str) -> TransactionModel:
        """

        :param trx_id:
        :return:
        """
        return self._transaction_repository.get_transaction(trx_id=trx_id)

    def get_transactions(self, start_date: str, end_date: str):
        if 'T' in start_date:
            dt = datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%S.%fZ')
            start_dt = dt.replace(hour=0)
        else:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')

        if 'T' in end_date:
            dt = datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%S.%fZ')
            end_dt = dt.replace(hour=0)
        else:
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')

        return self._transaction_repository.get_transactions(start_date=start_dt, end_date=end_dt)

    def get_future_transactions(self):
        return self._transaction_repository.get_future_transactions()

    def _test(self, value_to_compare, total_value):
        if total_value == 0:
            op = None
            percent = 'new'
        elif total_value > value_to_compare:
            value = total_value - value_to_compare
            op = '-'
            percent = round(value * 100 / total_value, 2)
        else:
            value = value_to_compare - total_value
            op = '+'
            percent = round(value * 100 / total_value, 2)

        if not op:
            return percent
        elif percent == 0.0:
            return f"{percent}%"
        else:
            return f'{op}{percent}%'

    def get_amount_by_category(self):
        # todo realizar conversão por timezone
        end_date = datetime.utcnow() - timedelta(hours=3)
        start_date = datetime(end_date.year, end_date.month, 1)

        last_start_date = start_date - relativedelta(months=1)
        final_end_date = start_date - relativedelta(seconds=1)

        trx_amount_by_categories = self._transaction_repository.get_trx_amount_by_categories(start_date=start_date,
                                                                                             end_date=end_date)

        last_full_trx_amount_by_categories = self._transaction_repository.get_trx_amount_by_categories(start_date=last_start_date,
                                                                                                       end_date=final_end_date)

        trx_amount_by_categories_to_ret = []
        for category, amount in trx_amount_by_categories.items():

            last_full_amount = last_full_trx_amount_by_categories.get(category, 0)

            percent_full = self._test(value_to_compare=amount, total_value=last_full_amount)

            formatted = {
                'category': category,
                'value': amount,
                'last_full_value': last_full_amount,
                'percent_full': percent_full
            }

            trx_amount_by_categories_to_ret.append(formatted)

        return trx_amount_by_categories_to_ret

    def update_trx_category(self, new_category: str, trx_id: str, type_: str):
        trx = self.get_transaction(trx_id=trx_id)
        trx.category = new_category
        trx.category_type = type_
        trx.save()

    def update_trx_title(self, new_transaction_name: str, id_: str, same_transaction_name: bool,
                         same_transaction_charge: bool):
        """

        :param new_transaction_name:
        :param id_:
        :param same_transaction_name:
        :param same_transaction_charge:
        :return:
        """
        trx = self.get_transaction(trx_id=id_)
        trx.title = new_transaction_name
        trx.same_transaction_name = same_transaction_name
        trx.same_transaction_charge = same_transaction_charge
        trx.save()

    def get_balance(self, end_date: datetime, start_date: datetime, bill: str):

        positive = self._transaction_repository.get_positive_account_transactions(start_date=start_date,
                                                                                  end_date=end_date)

        positive_transactions = [x.amount for x in positive]
        positive_value = 0
        if positive_transactions:
            positive_value = sum(positive_transactions)

        negative = self._transaction_repository.get_negative_account_transactions(start_date=start_date,
                                                                                  end_date=end_date)

        negative_transactions = [x.amount for x in negative]
        negative_value = 0
        if negative_transactions:
            negative_value = sum(negative_transactions)

        bill_amount = self._transaction_repository.get_bill_amount(bill)

        total = positive_value - (negative_value + bill_amount)

        return positive_value, negative_value, bill_amount, total

    def get_amount(self):
        end_date = datetime.utcnow()
        start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        bill = 'open_bill'

        positive_value, negative_value, bill_amount, bill_total = self.get_balance(bill=bill, start_date=start_date,
                                                                                   end_date=end_date)

        account_total = self._transaction_repository.get_account_amount()

        return account_total, bill_total
