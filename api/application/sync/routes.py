import base64
import json
import uuid
from datetime import datetime
from io import BytesIO
import time

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
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

    client = MongoClient(host='mongodb')
    db = client['nudashboard']
    collection = db['card_transactions']
    current_bill_info_collection = db['current_bill_info']

    bill_info = None
    bills = nu.get_bills()
    print(bills)
    for bill in bills:
        if bill['state'] == 'open':
            bill_info = bill
            print(bill_info)

    current_bill_info_collection.update_one(filter={'_id': 'account_balance'},
                                            update={'$set': {'value': nu.get_account_balance()}},
                                            upsert=True)

    if bill_info:
        latest_bill = bills[bills.index(bill_info)+1]

        current_bill_info_collection.update_one(filter={'_id': 'open_bill'},
                                                update={'$set': {'total_balance': bill_info['summary']['total_balance']}},
                                                upsert=True)

        current_bill_info_collection.update_one(filter={'_id': 'lastest_bill'},
                                                update={'$set': {'total_balance': latest_bill['summary']['total_balance']}},
                                                upsert=True)

        open_bill_id = str(uuid.uuid4())
        latest_bill_id = latest_bill['id']

        open_bill_transactions = nu.get_bill_details(bill_info)['bill']['line_items']
        latest_bill_transactions = nu.get_bill_details(latest_bill)['bill']['line_items']
        account_transactions = nu.get_account_statements()

        print('account')
        for trx in account_transactions:
            formatted_trx = _format_account_transaction(trx=trx)
            try:
                collection.insert_one(formatted_trx)
            except Exception as e:
                print(e)
                pass

        print('bill')
        for trx in open_bill_transactions:
            filter_, update_ = _format_bill_transaction(trx=trx, bill_id=open_bill_id)
            print(filter_, update_)
            if filter_:
                try:
                    collection.update_one(filter=filter_, update=update_, upsert=True)
                except Exception as e:
                    print(e)
                    pass

        print('latest bill')
        for trx in latest_bill_transactions:
            filter_, update_ = _format_bill_transaction(trx=trx, bill_id=latest_bill_id)
            print(filter_, update_)
            if filter_:
                try:
                    collection.update_one(filter=filter_, update=update_, upsert=True)
                except Exception as e:
                    print(e)
                    pass

        return jsonify({'msg': 'Success'}), 200

    return jsonify({'msg': 'Internal server error.'}), 500
