import base64
import json
from datetime import datetime
from io import BytesIO

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pynubank import Nubank

synchronize_blueprint = Blueprint(name='synchronize_blueprint', import_name='synchronize_blueprint')


def _format_bill_transaction(trx: dict, bill_id: str):
    print(trx)

    if trx['title'] == 'Pagamento recebido':
        return

    post_date = datetime.strptime(trx['post_date'], '%Y-%m-%d')
    trx['post_date'] = post_date
    trx['_id'] = trx['id']
    trx.pop('id')

    ref_id = trx['href'].split('/')[-1]
    trx['ref_id'] = ref_id
    trx.pop('href')

    trx['bill_id'] = bill_id

    if not trx.get('category'):
        trx['category'] = trx['type_detail']

    if trx.get('charges') and trx['charges'] == 1:
        trx.pop('index')
        trx.pop('charges')

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

    client = MongoClient()
    db = client['nudashboard']
    collection = db['card_transactions']

    bill_info = None
    bills = nu.get_bills()
    for bill in bills:
        if bill['state'] == 'open':
            bill_info = bill

    if bill_info:
        latest_bill = bills[bills.index(bill_info)+1]

        open_bill_id = bill_info['_links']['self']['href'].split('/')[-1]
        latest_bill_id = bill_info['_links']['self']['href'].split('/')[-1]

        open_bill_transactions = nu.get_bill_details(bill_info)['bill']['line_items']
        latest_bill_transactions = nu.get_bill_details(latest_bill)['bill']['line_items']

        for trx in open_bill_transactions:
            formatted_trx = _format_bill_transaction(trx=trx, bill_id=open_bill_id)
            if formatted_trx:
                try:
                    collection.insert_one(formatted_trx)
                except Exception as e:
                    pass

        for trx in latest_bill_transactions:
            formatted_trx = _format_bill_transaction(trx=trx, bill_id=latest_bill_id)
            if formatted_trx:
                try:
                    collection.insert_one(formatted_trx)
                except Exception as e:
                    pass

        return jsonify({'msg': 'Success'}), 200

    return jsonify({'msg': 'Internal server error.'}), 500
