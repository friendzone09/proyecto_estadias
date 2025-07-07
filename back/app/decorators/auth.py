from functools import wraps
from flask import request, jsonify, current_app
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('ghamaris_token')

        if not token:
            return jsonify({'message': 'Token no encontrado', 'type': 'error'}), 403

        try:
            decoded = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            return f(decoded, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado', 'type': 'error'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido', 'type': 'error'}), 403

    return decorated