from flask import Flask
from flask_cors import CORS

from application.sync.routes import synchronize_blueprint
from application.transactions.routes import transaction_blueprint
from config import create_config
from routes import root_blueprint


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "*"}})

    app.app_config = create_config()

    app.register_blueprint(root_blueprint)
    app.register_blueprint(synchronize_blueprint)
    app.register_blueprint(transaction_blueprint)

    return app
