from datetime import datetime
from typing import List

from flask import Blueprint, current_app, jsonify, request

from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository
from application.transactions.service import TransactionService

transaction_blueprint = Blueprint(name='transaction_blueprint', import_name='transaction_blueprint')


def _format_amount(amount: float):
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
            'titleById': transaction.title_by_trx_id,
            'titleByMap': transaction.title_by_raw_title,
            'titleByRef': transaction.title_by_ref_id,
            'category': transaction.category,
            'rawCategory': transaction.raw_category,
            'categoryById': transaction.category_by_trx_id,
            'categoryByMap': transaction.category_by_trx_title,
            'amount': _format_amount(transaction.amount),
            'dt': _format_date(transaction.time),
            'charges': transaction.charges,
            'chargesPaid': transaction.charges_paid,
            'type': transaction.type
        }
        formatted_transactions.append(trx)
    return formatted_transactions


@transaction_blueprint.route('/transactions', methods=['GET'])
def get_transactions():
    params = dict(request.args)

    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    transactions = service.get_transactions(start_date=params['startDate'], end_date=params['endDate'])
    formatted_transactions = _format_transactions(transactions)

    return jsonify(formatted_transactions), 200


@transaction_blueprint.route('/transactions/category/amount', methods=['GET'])
def get_amount_by_category():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    amount_by_category = service.get_amount_by_category()

    sorted_amount_by_category = sorted(amount_by_category, key=lambda k: k['value'], reverse=True)
    amount_by_category = [{'category': x['category'], 'percentile': x['percent'], 'value': _format_amount(x['value']), 'lastValue': _format_amount(x['last_value']), 'percentileFull': x['percent_full'], 'lastFullValue': _format_amount(x['last_full_value'])} for x in sorted_amount_by_category]

    return jsonify(amount_by_category), 200


@transaction_blueprint.route('/transaction/category/update', methods=['PUT'])
def update_transaction_category():
    req_content = request.get_json(force=True)

    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    service.update_trx_category(new_category=req_content['category'].strip(), trx_id=req_content['id'].strip(),
                                type_=req_content['type'].strip())

    transactions = service.get_transactions(start_date=req_content['startDate'], end_date=req_content['endDate'])
    formatted_transactions = _format_transactions(transactions)
    return jsonify(formatted_transactions), 200


@transaction_blueprint.route('/transaction/update', methods=['POST'])
def update_transaction():
    req_content = request.get_json(force=True)

    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    service.update_trx_title(new_transaction_name=req_content['transactionName'].strip(), id_=req_content['id'],
                             same_transaction_name=req_content['sameTransactionName'],
                             same_transaction_charge=req_content['sameTransactionCharge'])

    return jsonify({'msg': 'Transaction has been updated.'}), 200
