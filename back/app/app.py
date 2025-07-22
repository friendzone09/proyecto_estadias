from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import os
import logging
#views
from app.views.home_views import home_views
from app.views.appoint_views import appoint_viwes
from app.views.psycho_views import psycho_views
from app.views.user_views import user_views

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

origins = os.getenv('CORS_ORIGINS', '').split(',')

CORS(app, supports_credentials=True, origins=origins)

logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

app.register_blueprint(home_views)
app.register_blueprint(appoint_viwes)
app.register_blueprint(psycho_views)
app.register_blueprint(user_views)

@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Error no controlado: {e}", exc_info=True)
    return jsonify({
        'message': 'Ocurrió un error inesperado en el servidor',
        'type': 'error'
    }), 500

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'message': 'La ruta que intentas acceder no existe',
        'type': f'{error}'
    }), 404

@app.errorhandler(403)
def forbidden_error(error):
    return jsonify({
        'message': 'No tienes permiso para acceder a este recurso',
        'type': 'error'
    }), 403

if __name__ == '__main__':
    from dotenv import load_dotenv
    import os

    debug_mode = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='127.0.0.1', port=5000, debug=debug_mode)