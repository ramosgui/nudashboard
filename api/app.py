from flask import Flask
from flask_cors import CORS

from application.sync.routes import synchronize_blueprint
from application.transactions.routes import transaction_blueprint
from config import create_config
from routes import root_blueprint


def environ_factory(environ: str):
    if environ == 'TEST':
        config = {
            'mongodb': {
                'port': 28001,
                'host': 'localhost'
            }
        }
    elif environ == 'DOCKER':
        config = {
            'mongodb': {
                'port': 27017,
                'host': 'mongodb'
            }
        }
    else:
        raise Exception('AMBIENTE NAO MAPEADO')

    return config


def create_app(environ: str):
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "*"}})

    config = environ_factory(environ)

    app.app_config = create_config(config)

    app.register_blueprint(root_blueprint)
    app.register_blueprint(synchronize_blueprint)
    app.register_blueprint(transaction_blueprint)

    return app
