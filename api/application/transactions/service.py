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
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        return self._transaction_repository.get_transactions(start_date=start_date, end_date=end_date)

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
        end_date = datetime.utcnow()
        start_date = datetime(end_date.year, end_date.month, 1)

        last_start_date = start_date - relativedelta(months=1)
        last_end_date = end_date - relativedelta(months=1)
        final_end_date = start_date - relativedelta(seconds=1)

        trx_amount_by_categories = self._transaction_repository.get_trx_amount_by_categories(start_date=start_date,
                                                                                             end_date=end_date)

        last_trx_amount_by_categories = self._transaction_repository.get_trx_amount_by_categories(start_date=last_start_date,
                                                                                                  end_date=last_end_date)

        last_full_trx_amount_by_categories = self._transaction_repository.get_trx_amount_by_categories(start_date=last_start_date,
                                                                                                       end_date=final_end_date)

        trx_amount_by_categories_to_ret = []
        for category, amount in trx_amount_by_categories.items():

            last_amount = last_trx_amount_by_categories.get(category, 0)
            last_full_amount = last_full_trx_amount_by_categories.get(category, 0)

            percent = self._test(value_to_compare=amount, total_value=last_amount)
            percent_full = self._test(value_to_compare=amount, total_value=last_full_amount)

            formatted = {
                'category': category,
                'value': amount,
                'last_value': last_amount,
                'last_full_value': last_full_amount,
                'percent': percent,
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
