import os

from app import create_app

if __name__ == '__main__':
    environ = os.getenv('ENVIRONMENT')
    if not environ:
        raise Exception('Configure a variável de ambiente antes de continuar.')

    app = create_app(environ=environ)
    app.run(host='0.0.0.0', port=5050, debug=False)

