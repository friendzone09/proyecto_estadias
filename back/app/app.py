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

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, supports_credentials=True, origins=[os.getenv('CORS_ORIGINS')])

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

if __name__ == '__main__':
    from dotenv import load_dotenv
    import os

    load_dotenv()

    debug_mode = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='127.0.0.1', port=5000, debug=debug_mode)