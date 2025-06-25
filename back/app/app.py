from flask import Flask
from flask_cors import CORS

import os
#views
from app.views.home_views import home_views
from app.views.appoint_views import appoint_viwes
from app.views.psycho_views import psycho_views
from app.views.user_views import user_views

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super_secret_password'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.register_blueprint(home_views)
app.register_blueprint(appoint_viwes)
app.register_blueprint(psycho_views)
app.register_blueprint(user_views)

if __name__ =='__main__':
    app.run(host="localhost", port=5000, debug=True)