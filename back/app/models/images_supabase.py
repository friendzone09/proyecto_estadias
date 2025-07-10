import requests
import uuid
import os

from flask import current_app

SUPABASE_URL= os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
BUCKET_NAME = 'profile-images'

def upload_image_to_supabase(file):
    filename = f"{uuid.uuid4()}_{file.filename}"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"

    headers = {
        'apikey' : SUPABASE_KEY,
        'Authorization' : f"Bearer {SUPABASE_KEY}",
        'Content-Type' : file.content_type,
    }

    response = requests.put(upload_url, data=file.read(), headers=headers)

    if response.status_code in [200, 201]:
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
        return public_url
    else:
        print('Error al subir la imagen:' , response.text)
        return None