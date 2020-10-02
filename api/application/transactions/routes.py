from datetime import datetime, timedelta
from typing import List

from dateutil.relativedelta import relativedelta
from flask import Blueprint, current_app, jsonify, request

from application.transactions.model import TransactionModel
from application.transactions.repository import TransactionRepository
from application.transactions.service import TransactionService

transaction_blueprint = Blueprint(name='transaction_blueprint', import_name='transaction_blueprint')


def _convert_dt_str_to_dt(str_dt: str, dt_format: str = '%Y-%m-%dT%H:%M:%S.%fZ') -> datetime:
    return datetime.strptime(str_dt, dt_format)


def _format_amount(amount: float):
    # todo ficar no front end futuramente
    value = '{:,.2f}'.format(amount).strip()
    value = 'R$ {}'.format(value)
    return value.replace(',', '#').replace('.', ',').replace('#', '.')


def _format_date(dt: datetime):
    return dt.strftime('%d/%m/%Y')


def _format_transactions(transactions: List[TransactionModel]):
    formatted_transactions = []
    for transaction in transactions:

        trx = {
            'id': transaction.id,
            'refId': transaction.ref_id,
            'title': transaction.name,
            'rawTitle': transaction.raw_title,
            'titleById': transaction.title_by_id,
            'titleByMap': transaction.title_by_name,
            'titleByRef': transaction.title_by_ref_id,
            'category': transaction.category,
            'rawCategory': transaction.raw_category,
            'categoryById': transaction.category_by_trx_id,
            'categoryByMap': transaction.category_by_trx_name,
            'amount': round(transaction.amount, 2),
            'dt': _format_date(transaction.time),
            'charges': transaction.charges,
            'chargesPaid': transaction.charges_paid,
            'type': transaction.type,
            'sameNameCheck': transaction.same_name_check,
            'sameCategoryCheck': transaction.same_category_check,
            'useRawCategory': transaction.use_raw_category,
            'isFixed': transaction.is_fixed
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

    categories_col = current_app.app_config.mongodb.categories_collection

    categories = {}
    for category in categories_col.find({}):
        categories[category['_id']] = {
            'icon': category['icon'],
            'color': category['color'],
            'type': category['type']
        }

    formatted_transactions = sorted(formatted_transactions, key=lambda k: k['dt'], reverse=True)

    return jsonify({'transactions': formatted_transactions, 'categories': categories}), 200


@transaction_blueprint.route('/future_transactions', methods=['GET'])
def get_future_transactions():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)
    transactions = service.get_future_transactions()

    formatted_transactions = _format_transactions(transactions)
    formatted_transactions = sorted(formatted_transactions, key=lambda k: k['dt'], reverse=True)

    categories_col = current_app.app_config.mongodb.categories_collection

    categories = {}
    for category in categories_col.find({}):
        categories[category['_id']] = {
            'icon': category['icon'],
            'color': category['color'],
            'type': category['type']
        }

    return jsonify({'qtd': len(transactions),
                    'value': _format_amount(sum([x.amount for x in transactions])),
                    'transactions': formatted_transactions,
                    'categories': categories}), 200


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

    info = req_content['auxValues']

    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    transaction = service.get_transaction(info['id'])
    category_col = current_app.app_config.mongodb.category_mapping_collection
    title_col = current_app.app_config.mongodb.title_mapping_collection
    trx_col = current_app.app_config.mongodb.card_transactions_collections
    fixed_col = current_app.app_config.mongodb.fixed_transaction_collection

    if info['sameCategory'] is False:
        category_col.remove({'_id': info['trx']})
        category_col.update_one({'_id': info['id']}, {'$set': {'value': info['category']}}, upsert=True)

    elif info['sameCategory'] is True:
        category_col.remove({'_id': info['id']})
        category_col.update_one({'_id': info['trx']}, {'$set': {'value': info['category']}}, upsert=True)

    if info['sameTransactionName'] is False:
        title_col.update_one({'_id': info['id']}, {'$set': {'value': info['trx']}}, upsert=True)
        if transaction.charges:
            title_col.update_one({'_id': transaction.ref_id}, {'$set': {'value': info['trx']}}, upsert=True)

    elif info['sameTransactionName'] is True:
        title_col.remove({'_id': transaction.id})
        title_col.update_one({'_id': transaction.raw_title}, {'$set': {'value': info['trx']}}, upsert=True)

    elif info['id']:
        title_col.update_one({'_id': info['id']}, {'$set': {'value': info['trx']}}, upsert=True)
        if transaction.charges:
            title_col.update_one({'_id': transaction.ref_id}, {'$set': {'value': info['trx']}}, upsert=True)

    if info['fixedTransaction'] is False:
        # trxs_to_update = []
        # for trx in title_col.find({'value': info['trx']}):
        #     trxs_to_update.append(trx['_id'])
        # trx_col.update_many({'_id': {'$in': trxs_to_update}}, {'$set': {'fixed': False}})
        # trx_col.update_many({'title': {'$in': trxs_to_update}}, {'$set': {'fixed': False}})
        fixed_col.remove({'_id': info['trx']})

    elif info['fixedTransaction'] is True:
        # trxs_to_update = []
        # for trx in title_col.find({'value': info['trx']}):
        #     trxs_to_update.append(trx['_id'])
        # trx_col.update_many({'_id': {'$in': trxs_to_update}}, {'$set': {'fixed': True}})
        # trx_col.update_many({'title': {'$in': trxs_to_update}}, {'$set': {'fixed': True}})
        fixed_col.insert_one({'_id': info['trx']})

    return jsonify({'msg': 'Transaction has been updated.'}), 200


@transaction_blueprint.route('/transactions/transfer_in', methods=['GET'])
def transfer_in_transactions():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    end_date = datetime.utcnow()
    start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    bill = 'current_bill'

    positive_value, negative_value, bill_amount, bill_state = service.get_balance(start_date=start_date,
                                                                                  end_date=end_date,
                                                                                  bill=bill)

    total = positive_value - (negative_value + bill_amount)

    return jsonify({
        'positive': _format_amount(positive_value),
        'negative': _format_amount(negative_value * -1),
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
    bill = 'lastest_bill'

    positive_value, negative_value, bill_amount, bill_state = service.get_balance(start_date=start_date,
                                                                                  end_date=end_date,
                                                                                  bill=bill)

    total = positive_value - (negative_value + bill_amount)

    if isinstance(bill_amount, int):
        bill_amount = _format_amount(bill_amount * -1)

    return jsonify({
        'positive': _format_amount(positive_value),
        'negative': _format_amount(negative_value * -1),
        'fatura': _format_amount(bill_amount * -1),
        'total': _format_amount(total)
    }), 200


@transaction_blueprint.route('/account/amount', methods=['GET'])
def account_amount():
    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    account_total, positive_value, negative_value, bill_amount, bill_state = service.get_amount()
    if account_total is None:
        account_total = {'value': 0}

    if bill_state and bill_state != 'open':
        bill_out = 'FATURA PAGA'
        total = _format_amount(account_total['value'])

    else:
        account_balance = account_total['value']
        bill_value = bill_amount * -1
        bill_out = _format_amount(bill_value)
        total = _format_amount(account_balance + bill_value)

    return jsonify({
        'account_total': _format_amount(account_total['value']),
        'bill_out': bill_out,
        'total': total
    }), 200


@transaction_blueprint.route('/transactions/fixed', methods=['GET'])
def get_fixed_transactions():
    params = dict(request.args)

    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    start_date = _convert_dt_str_to_dt(params['startDate'])
    end_date = _convert_dt_str_to_dt(params['endDate'])

    transactions = service.get_fixed_transactions(start_date=start_date, end_date=end_date)
    formatted_transactions = _format_transactions(transactions)

    return jsonify(formatted_transactions), 200


@transaction_blueprint.route('/transactions/fixed/amount', methods=['GET'])
def get_fixed_transactions_amount():
    params = dict(request.args)

    transaction_repository = TransactionRepository(mongodb=current_app.app_config.mongodb)
    service = TransactionService(transaction_repository=transaction_repository)

    # start_date = _convert_dt_str_to_dt(params['startDate'])
    # end_date = _convert_dt_str_to_dt(params['endDate'])

    positive_amount, negative_amount = service.get_amount_from_fixed_transactions(start_date=params['startDate'],
                                                                                  end_date=params['endDate'])

    return jsonify({
        'positive': _format_amount(positive_amount),
        'negative': _format_amount(negative_amount * -1),
        'total': _format_amount(positive_amount + (negative_amount * -1))
    }), 200


# TODO NOMEAR PARCELAR AUTOMATICAMENTE
# TODO PARA TRANSAÇÕES FIXAS, ALTERAR ICONE, DE ACORDO COM A TRANSAÇÃO (SE JA FOI PAGO FICA VERDE, SE AINDA NAO TEVE UMA TRANSAÇÃO FIXA NO MES, FICA VERMELHO)
