import base64
import json
import uuid
from datetime import datetime, timedelta
from io import BytesIO

from flask import Blueprint, request, jsonify, current_app
from pynubank import Nubank

synchronize_blueprint = Blueprint(name='synchronize_blueprint', import_name='synchronize_blueprint')


def _format_bill_transaction(trx: dict, bill_id: str):
    if trx['title'] == 'Pagamento recebido':
        return None, None

    filter_ = {'_id': trx['id']}

    post_date = datetime.strptime(trx['post_date'], '%Y-%m-%d')
    trx['post_date'] = post_date
    trx['_id'] = trx['id']
    trx['amount'] = trx['amount'] / 100

    trx.pop('id')

    trx['type'] = 'credit'

    ref_id = trx['href'].split('/')[-1]
    trx['ref_id'] = ref_id
    trx.pop('href')

    trx['bill_id'] = bill_id

    if not trx.get('category'):
        trx['category'] = trx['type_detail']

    if trx.get('charges') and trx['charges'] == 1:
        trx.pop('index')
        trx.pop('charges')

    return filter_, {'$set': trx}


def _format_account_transaction(trx: dict):
    if trx['title'] == 'Pagamento da fatura':
        return

    trx['post_date'] = datetime.strptime(trx['postDate'], '%Y-%m-%d')
    trx['type'] = 'account'
    trx['_id'] = trx['id']
    trx['category'] = trx['__typename']
    trx.pop('__typename')
    trx.pop('id')

    return trx


@synchronize_blueprint.route('/sync/qr_code', methods=['GET'])
def get_qr_code():
    nu = Nubank()
    uuid, qr_code = nu.get_qr_code()

    buffered = BytesIO()
    img = qr_code.make_image()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({'base64': img_str, 'uuid': uuid}), 200


@synchronize_blueprint.route('/sync', methods=['POST'])
def sync():
    req = json.loads(request.data)

    nu = Nubank()
    nu.authenticate_with_qr_code(req['cpf'], req['password'], req['qr_uuid'])

    mongodb = current_app.app_config.mongodb
    transaction_collection = mongodb.card_transactions_collections
    current_bill_info_collection = mongodb.current_bill_info_collection

    bill_info = None
    bills = nu.get_bills()
    for bill in bills:
        if datetime.utcnow().strftime('%Y-%m') in bill['summary']['close_date']:
            bill_info = bill

    current_bill_info_collection.update_one(filter={'_id': 'account_balance'},
                                            update={'$set': {'value': nu.get_account_balance()}},
                                            upsert=True)

    if bill_info:
        latest_bill = bills[bills.index(bill_info)+1]
        future_bill = bills[bills.index(bill_info)-1]

        current_bill_info_collection.update_one(filter={'_id': 'current_bill'},
                                                update={'$set': {
                                                    'total_balance': bill_info['summary']['total_balance'],
                                                    'state': bill_info['state']
                                                }},
                                                upsert=True)

        current_bill_info_collection.update_one(filter={'_id': 'lastest_bill'},
                                                update={'$set': {
                                                    'total_balance': latest_bill['summary']['total_balance'],
                                                    'state': latest_bill['state']
                                                }},
                                                upsert=True)

        current_bill_info_collection.update_one(filter={'_id': 'future_bill'},
                                                update={'$set': {
                                                    'total_balance': future_bill['summary']['total_balance'],
                                                    'state': future_bill['state']
                                                }},
                                                upsert=True)

        current_bill_info_collection.update_one(filter={'_id': 'latest_update_dt'},
                                                update={'$set': {
                                                    'dt': datetime.utcnow().isoformat()}
                                                },
                                                upsert=True)

        current_bill_id = str(uuid.uuid4())
        latest_bill_id = latest_bill['id']

        open_bill_transactions = nu.get_bill_details(bill_info)['bill']['line_items']
        latest_bill_transactions = nu.get_bill_details(latest_bill)['bill']['line_items']
        account_transactions = nu.get_account_statements()

        for trx in account_transactions:
            formatted_trx = _format_account_transaction(trx=trx)
            try:
                transaction_collection.insert_one(formatted_trx)
            except Exception as e:
                print(e)
                pass

        for trx in open_bill_transactions:
            filter_, update_ = _format_bill_transaction(trx=trx, bill_id=current_bill_id)
            if filter_:
                try:
                    transaction_collection.update_one(filter=filter_, update=update_, upsert=True)
                except Exception as e:
                    print(e)
                    pass

        for trx in latest_bill_transactions:
            filter_, update_ = _format_bill_transaction(trx=trx, bill_id=latest_bill_id)
            if filter_:
                try:
                    transaction_collection.update_one(filter=filter_, update=update_, upsert=True)
                except Exception as e:
                    print(e)
                    pass

        return jsonify({'msg': 'Success'}), 200

    return jsonify({'msg': 'Internal server error.'}), 500


@synchronize_blueprint.route('/sync/last_updated', methods=['GET'])
def last_updated():
    current_bill_info_collection = current_app.app_config.mongodb.current_bill_info_collection
    result = current_bill_info_collection.find_one({'_id': 'latest_update_dt'})
    if result:
        # TODO fazer com timezone, tirar hardcoded
        dt = datetime.fromisoformat(result['dt']) - timedelta(hours=3)
        dt = dt.strftime('%c')
    else:
        dt = 'SINCRONIZAÇÃO NUNCA REALIZADA.'
    return jsonify({'dt': dt}), 200
