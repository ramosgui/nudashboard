from datetime import datetime, timedelta
from typing import List

from dateutil.relativedelta import relativedelta

from application.categories.repository import CategoriesRepository
from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository


class TransactionService:

    def __init__(self, transactions_repository: TransactionRepository, categories_repository: CategoriesRepository):
        """

        :param transactions_repository:
        :param categories_repository:
        """
        self._transactions_repository = transactions_repository
        self._categories_repository = categories_repository

    @staticmethod
    def _percentile(number1, number2):
        return (number1 / number2) * 100

    @staticmethod
    def _get_amount_from_transactions(transactions: List[TransactionModel]):
        transactions_amount = [x.amount for x in transactions]
        return sum(transactions_amount)

    def get_transaction(self, trx_id: str) -> TransactionModel:
        """

        :param trx_id:
        :return:
        """
        return self._transactions_repository.get_transaction(trx_id=trx_id)

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

        transactions = self._transactions_repository.get_transactions(start_date=start_dt, end_date=end_dt)

        fixed_transactions = self._transactions_repository.get_fixed_transactions_new()

        transaction_by_names = {}
        for transaction in transactions:
            transaction_by_names[transaction.name] = transaction

        fixed_transactions_to_return = []
        for fixed_transaction in fixed_transactions:

            if fixed_transaction not in transaction_by_names:

                transactions_by_name = self._transactions_repository.get_transactions_by_name(fixed_transaction)
                if transactions_by_name:
                    new_positive_amount = sum([x.amount for x in transactions_by_name]) / len(transactions_by_name)

                # trx_model = TransactionModel(category_map_collection=self._repository._category_mapping_collection,
                #                              title_mapping_collection=self._repository._title_mapping_collection,
                #                              id_=None, post_date=datetime.utcnow(), raw_title=fixed_transaction,
                #                              raw_category=transactions_by_name[-1].raw_category, charges=None, amount=new_positive_amount, ref_id=None,
                #                              index=None, type_=transactions_by_name[-1].type, is_fixed='not')

                    trx_model = self._transactions_repository._create_transaction_model({
                        '_id': transactions_by_name[-1].id, 'post_date': datetime.utcnow(), 'title': transactions_by_name[-1].raw_title,
                        'category': transactions_by_name[-1]._raw_category, 'amount': new_positive_amount,
                        'type': transactions_by_name[-1].type
                    })

                    trx_model.is_fixed = 'not'

                    fixed_transactions_to_return.append(trx_model)

        transactions.extend(fixed_transactions_to_return)

        # SORT
        trx_sort = {
            'fixed_false': [],
            'all': []
        }
        for transaction in transactions:
            if transaction.is_fixed == 'not':
                trx_sort['fixed_false'].append(transaction)
            else:
                trx_sort['all'].append(transaction)

        # trx_sort['fixed_true'] = [x for x in sorted(trx_sort['fixed_true'], key=lambda k: (k.category, k.time), reverse=True)]
        trx_sort['fixed_false'] = [x for x in sorted(trx_sort['fixed_false'], key=lambda k: (k.category, k.time), reverse=True)]
        trx_sort['all'] = [x for x in sorted(trx_sort['all'], key=lambda k: (k.time, k.category), reverse=True)]

        all_transactions = trx_sort['fixed_false'] + trx_sort['all']

        return all_transactions

    def get_future_transactions(self):
        return self._transactions_repository.get_future_transactions()

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

        trx_amount_by_categories = self._transactions_repository.get_trx_amount_by_categories(start_date=start_date,
                                                                                              end_date=end_date)

        last_full_trx_amount_by_categories = self._transactions_repository.get_trx_amount_by_categories(start_date=last_start_date,
                                                                                                        end_date=final_end_date)

        trx_amount_by_categories_to_ret = []
        for category, last_full_amount in last_full_trx_amount_by_categories.items():

            amount = trx_amount_by_categories.get(category, 0)

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
        trx.name = new_transaction_name
        trx.same_transaction_name = same_transaction_name
        trx.same_transaction_charge = same_transaction_charge
        trx.save()

    def get_balance(self, end_date: datetime, start_date: datetime, bill: str):

        in_transactions = self._transactions_repository.get_in_account_transactions(start_date=start_date,
                                                                                    end_date=end_date)

        out_transactions = self._transactions_repository.get_out_account_transactions(start_date=start_date,
                                                                                      end_date=end_date)

        in_amount_total = self._get_amount_from_transactions(in_transactions)
        out_amount_total = self._get_amount_from_transactions(out_transactions)

        bill_amount, bill_state = self._transactions_repository.get_bill_amount(bill)

        return round(in_amount_total, 2), round(out_amount_total * -1, 2), round(bill_amount * -1, 2), bill_state

    def get_amount(self):
        end_date = datetime.utcnow() - timedelta(hours=3)
        start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        bill = 'current_bill'

        positive_value, negative_value, bill_amount, bill_state = self.get_balance(bill=bill,
                                                                                   start_date=start_date,
                                                                                   end_date=end_date)

        account_total = self._transactions_repository.get_account_amount()

        return account_total, positive_value, negative_value, bill_amount, bill_state

    def get_fixed_transactions(self, start_date: datetime, end_date: datetime) -> List[TransactionModel]:
        return self._transactions_repository.get_fixed_transactions(start_date=start_date, end_date=end_date)

    def get_amount_from_fixed_transactions(self, start_date: str, end_date: str) -> (float, float):

        transactions = self.get_transactions(start_date=start_date, end_date=end_date)

        positive_transactions = []
        negative_transactions = []

        for transaction in transactions:
            if transaction.is_fixed in ['not', True]:
                if transaction._raw_category == 'TransferInEvent':
                    positive_transactions.append(transaction)
                else:
                    negative_transactions.append(transaction)

        new_positive_amount = 0
        for trx in positive_transactions:
            transactions = self._transactions_repository.get_transactions_by_name(trx.name)
            new_positive_amount += sum([x.amount for x in transactions]) / len(transactions)

        new_negative_amount = 0
        for trx in negative_transactions:
            transactions = self._transactions_repository.get_transactions_by_name(trx.name)
            new_negative_amount += sum([x.amount for x in transactions]) / len(transactions)

        return new_positive_amount, new_negative_amount

    def get_bill(self, bill: str):
        amount, _ = self._transactions_repository.get_bill_amount(bill)
        return amount
