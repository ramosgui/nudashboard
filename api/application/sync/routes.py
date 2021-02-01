import base64
import json
import uuid
from datetime import datetime, timedelta
from io import BytesIO

from dateutil.relativedelta import relativedelta
from flask import Blueprint, request, jsonify, current_app
from pymongo.errors import DuplicateKeyError
from pynubank import Nubank

from application.sync.events.factory import account_event_factory, credit_event_factory

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
    nu.authenticate_with_qr_code(req['cpf'], req['password'], req['qr_uuid'])

    mongodb = current_app.app_config.mongodb
    account_feed_collection = mongodb.account_feed_collection
    credit_feed_collection = mongodb.credit_feed_collection

    account_feed = nu.get_account_feed()
    card_feed = nu.get_card_feed()['events']

    # f = open('fake_account_feed.txt', 'r')
    # account_feed = json.loads(f.read())
    # f.close()
    #
    # f = open('fake_card_feed.txt', 'r')
    # credit_feed = json.loads(f.read())['events']
    # f.close()

    for event in account_feed:
        transaction_model = account_event_factory(event)
        if transaction_model:
            try:
                account_feed_collection.insert_one(transaction_model.as_dict())
            except DuplicateKeyError:
                pass
            except Exception as e:
                raise e

    for event in card_feed:
        charges = event.get('details', {}).get('charges', {}).get('count')

        if charges:
            i = 0
            while i < charges:

                time_ = datetime.strptime(event['time'], '%Y-%m-%dT%H:%M:%SZ')
                t = time_ + relativedelta(months=i)

                new_event = event.copy()
                new_event['id'] = new_event['id'] + f'_{i}'
                new_event['time'] = t.isoformat() + 'Z'
                new_event['amount'] = event['details']['charges']['amount']
                new_event['charges'] = charges
                new_event['index'] = i+1
                event_model = credit_event_factory(new_event)

                try:
                    credit_feed_collection.insert_one(event_model.as_dict())
                except DuplicateKeyError:
                    pass
                except Exception as e:
                    raise e

                i = i + 1
        else:
            event_model = credit_event_factory(event)
            if event_model:
                try:
                    credit_feed_collection.insert_one(event_model.as_dict())
                except DuplicateKeyError:
                    pass
                except Exception as e:
                    raise e

    return jsonify({'msg': 'Success'}), 200


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
