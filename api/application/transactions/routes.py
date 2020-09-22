from datetime import datetime, timedelta
from typing import List

from dateutil.relativedelta import relativedelta
from flask import Blueprint, current_app, jsonify, request

from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository
from application.transactions.service import TransactionService

transaction_blueprint = Blueprint(name='transaction_blueprint', import_name='transaction_blueprint')


def _format_amount(amount: float):
    # todo ficar no front end futuramente
    value = '{:,.2f}'.format(amount).strip()
    value = 'R$ {}'.format(value)
    return value.replace(',', '#').replace('.', ',').replace('#', '.')


def _format_date(dt: datetime):
    return dt.strftime('%Y-%m-%d')


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

    return jsonify(sorted(formatted_transactions, key=lambda k: k['dt'], reverse=True)), 200


@transaction_blueprint.route('/future_transactions', methods=['GET'])
def get_future_transactions():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    transactions = service.get_future_transactions()

    formatted_transactions = _format_transactions(transactions)
    formatted_transactions = sorted(formatted_transactions, key=lambda k: k['dt'], reverse=True)

    return jsonify({'qtd': len(transactions),
                    'value': _format_amount(sum([x.amount for x in transactions])),
                    'transactions': formatted_transactions}), 200


@transaction_blueprint.route('/transactions/category/amount', methods=['GET'])
def get_amount_by_category():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    amount_by_category = service.get_amount_by_category()

    sorted_amount_by_category = sorted(amount_by_category, key=lambda k: k['value'], reverse=True)
    amount_by_category = [
        {'category': x['category'], 'value': _format_amount(x['value']), 'percentileFull': x['percent_full'],
         'lastFullValue': _format_amount(x['last_full_value'])} for x in sorted_amount_by_category]

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


@transaction_blueprint.route('/transactions/transfer_in', methods=['GET'])
def transfer_in_transactions():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    end_date = datetime.utcnow()
    start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    bill = 'open_bill'

    positive_transactions, negative_transactions, bill_amount, total = service.get_balance(start_date=start_date,
                                                                                           end_date=end_date,
                                                                                           bill=bill)

    return jsonify({
        'positive': _format_amount(positive_transactions),
        'negative': _format_amount(negative_transactions * -1),
        'fatura': _format_amount(bill_amount * -1),
        'total': _format_amount(total)
    }), 200


@transaction_blueprint.route('/transactions/last_transfer_in', methods=['GET'])
def last_transfer_in_transactions():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    end_date = datetime.utcnow()
    start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    end_date = start_date - timedelta(microseconds=1)
    start_date = start_date - relativedelta(months=1)
    bill = 'latest_bill'

    positive_transactions, negative_transactions, bill_amount, total = service.get_balance(start_date=start_date,
                                                                                           end_date=end_date,
                                                                                           bill=bill)

    return jsonify({
        'positive': _format_amount(positive_transactions),
        'negative': _format_amount(negative_transactions * -1),
        'fatura': _format_amount(bill_amount * -1),
        'total': _format_amount(total)
    }), 200


@transaction_blueprint.route('/account/amount', methods=['GET'])
def account_amount():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    account_total, bill_total = service.get_amount()
    if account_total is None:
        account_total = {'value': 0}

    return jsonify({
        'account_total': _format_amount(account_total['value']),
        'bill_total': _format_amount(bill_total),
        'total': _format_amount(account_total['value'] + bill_total)
    }), 200
