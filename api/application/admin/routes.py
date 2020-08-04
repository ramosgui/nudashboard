from flask import Blueprint, current_app, request, jsonify, render_template

admin_blueprint = Blueprint(name='adm', import_name='adm', url_prefix='/adm')


@admin_blueprint.route('transaction/category/update', methods=['POST'])
def update_trx_category():

    req_content = request.get_json(force=True)

    filters_ = {"_id": req_content['transactionId'].strip()}
    values = {"$set": {"new_category": req_content['category'].strip()}}
    card_transactions = current_app.app_config.mongodb.card_transactions_collections
    card_transactions.update_one(filters_, values)

    return jsonify({'msg': 'Transaction has been updated.'}), 200


@admin_blueprint.route('category/update', methods=['POST'])
def update_category():

    req_content = request.get_json(force=True)

    filters_ = {"_id": req_content['title'].strip()}
    values = {"$set": {"category": req_content['category'].strip()}}
    col = current_app.app_config.mongodb.category_mapping_collection
    col.update_one(filters_, values, upsert=True)

    return jsonify({'msg': 'Category has been updated.'}), 200


@admin_blueprint.route('transaction/title/update', methods=['POST'])
def update_trx_title():

    req_content = request.get_json(force=True)

    filters_ = {"_id": req_content['trxId'].strip()}
    values = {"$set": {"new_title": req_content['newTitle'].strip()}}
    card_transactions = current_app.app_config.mongodb.card_transactions_collections
    card_transactions.update_one(filters_, values)

    return jsonify({'msg': 'Title has been updated.'}), 200


@admin_blueprint.route('title/update', methods=['POST'])
def update_title():

    req_content = request.get_json(force=True)

    filters_ = {"_id": req_content['rawTitle'].strip()}
    values = {"$set": {"title": req_content['newTitle'].strip()}}
    col = current_app.app_config.mongodb.title_mapping_collection
    col.update_one(filters_, values, upsert=True)

    return jsonify({'msg': 'Title has been updated.'}), 200


@admin_blueprint.route('/', methods=['GET'])
def admin():
    return render_template('hello.html')
