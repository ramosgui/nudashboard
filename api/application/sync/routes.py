import base64
import json
from datetime import datetime
from io import BytesIO

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pynubank import Nubank

from mocked_statements.fake_statements import FAKE_CARD_STATEMENTS

synchronize_blueprint = Blueprint(name='synchronize_blueprint', import_name='synchronize_blueprint')


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
    # nu.authenticate_with_qr_code('10264726790', 's3YVcj0VAq71', req)
    nu.authenticate_with_qr_code(req['cpf'], req['password'], req['qr_uuid'])

    client = MongoClient()
    db = client['nudashboard']
    collection = db['card_transactions']

    bill = [x for x in nu.get_bills() if x['state'] == 'open'][0]
    bill_transactions = nu.get_bill_details(bill)

    for trx in bill_transactions['bill']['line_items']:
        print(trx)
        post_date = datetime.strptime(trx['post_date'], '%Y-%m-%d')
        trx['post_date'] = post_date
        trx['_id'] = trx['id']
        trx.pop('id')
        try:
            collection.insert_one(trx)
        except Exception as e:
            print(e)

    return jsonify({'msg': 'Success'}), 200


@synchronize_blueprint.route('/get', methods=['GET'])
def get_fake_transactions():
    return jsonify([{'firstName': 'Guilherme Ramos'}]), 200
