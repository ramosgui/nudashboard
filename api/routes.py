from datetime import datetime

import pytz
from flask import Blueprint, current_app, jsonify, request

from api.statements.category_service import CategoryService
from api.statements.description_service import DescriptionService
from api.statements.raw_statement_service import RawStatementService
from api.statements.statement_service import StatementService

root_blueprint = Blueprint(name='root_blueprint', import_name='root_blueprint')


def _format_statements(statements: dict):
    local_timezone = pytz.timezone('America/Sao_Paulo')

    formatted_statements = []
    for statement in statements:
        local_registered_at = statement['registered_at'].replace(tzinfo=pytz.utc).astimezone(local_timezone)
        statement_info = {
            'id': statement['_id'],
            'value': statement['amount'],
            'registeredAt': datetime.strftime(local_registered_at, '%Y-%m-%d %H:%M:%S'),
            'typeId': statement['type_id']
        }

        # TODO ESSA LÓGICA DEVE FICAR NO MODEL FUTURAMENTE
        if statement.get('description'):
            statement_info['description'] = statement.get('description')
        else:
            statement_info['description'] = statement['raw_description']

        if statement.get('category'):
            statement_info['category'] = statement.get('category')
        else:
            statement_info['category'] = statement['raw_category']

        formatted_statements.append(statement_info)
    return formatted_statements


@root_blueprint.route('/get_statements', methods=['POST'])
def get_statements():
    raw_statement_service = RawStatementService()
    service = StatementService(mongodb=current_app.mongodb, raw_statement_service=raw_statement_service)
    statements = service.get_latest_statements(limit=100)

    return jsonify(_format_statements(statements)), 200


@root_blueprint.route('/edit/statement/description', methods=['PUT'])
def edit_statement_description():
    data = request.json

    service = DescriptionService(mongodb=current_app.mongodb)
    service.create_description(description=data['newDescription'], statement_id=data['id'])

    return jsonify({'msg': 'Statement has been updated.'}), 200


@root_blueprint.route('/edit/statements/description', methods=['PUT'])
def edit_statements_description():
    data = request.json

    service = DescriptionService(mongodb=current_app.mongodb)
    service.create_description(description=data['newDescription'], raw_description=data['oldDescription'])

    return jsonify({'msg': 'Statement has been updated.'}), 200


@root_blueprint.route('/edit/statement/category_by_description', methods=['PUT'])
def edit_statement_category_by_description():
    data = request.json

    service = CategoryService(mongodb=current_app.mongodb)
    service.create_category(category=data['newCategory'], description=data['description'])

    return jsonify({'msg': 'Statement has been updated.'}), 200


@root_blueprint.route('/edit/statement/category_by_statement_id', methods=['PUT'])
def edit_statement_category_by_statement_id():
    data = request.json

    service = CategoryService(mongodb=current_app.mongodb)
    service.create_category(category=data['newCategory'], statement_id=data['id'])

    return jsonify({'msg': 'Statement has been updated.'}), 200


@root_blueprint.route('/edit/statements/category', methods=['PUT'])
def edit_statements_category():
    data = request.json

    service = CategoryService(mongodb=current_app.mongodb)
    service.create_category(category=data['newCategory'], statement_id=data['oldCategory'])

    return jsonify({'msg': 'Statement has been updated.'}), 200
