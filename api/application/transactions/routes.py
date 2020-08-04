from datetime import datetime
from typing import List

from flask import Blueprint, current_app, jsonify

from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository
from application.transactions.service import TransactionService

transaction_blueprint = Blueprint(name='transaction_blueprint', import_name='transaction_blueprint')


def _format_amount(amount: int):
    # todo ficar no front end futuramente
    value = 'R$ {:,.2f}'.format(amount).strip()
    return value.replace(',', '#').replace('.', ',').replace('#', '.')


def _format_date(dt: datetime):
    return dt.strftime('%d/%m/%Y')


def _format_transactions(transactions: List[TransactionModel]):
    formatted_transactions = []
    for transaction in transactions:
        trx = {
            'id': transaction.id,
            'refId': transaction.ref_id,
            'title': transaction.title,
            'rawTitle': transaction.raw_title,
            'titleById': transaction.title_by_id,
            'titleByMap': transaction.title_by_map,
            'titleByRef': transaction.title_by_ref,
            'category': transaction.category,
            'rawCategory': transaction.raw_category,
            'categoryById': transaction.category_by_id,
            'categoryByMap': transaction.category_by_map,
            'amount': _format_amount(transaction.amount),
            'dt': _format_date(transaction.time),
            'charges': transaction.charges,
            'chargesPaid': transaction.charges_paid
        }

        formatted_transactions.append(trx)
    return formatted_transactions


@transaction_blueprint.route('/transactions', methods=['GET'])
def get_transactions():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    transactions = service.get_transactions()
    formatted_transactions = _format_transactions(transactions)

    return jsonify(formatted_transactions), 200


@transaction_blueprint.route('/transactions/category/amount', methods=['GET'])
def get_amount_by_category():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    amount_by_category = service.get_amount_by_category()
    sorted_amount_by_category = sorted(amount_by_category, key=lambda k: k['value'], reverse=True)
    return jsonify(sorted_amount_by_category), 200
