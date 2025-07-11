from PIL import Image
from io import BytesIO

import requests
import uuid
import os

SUPABASE_URL= os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
BUCKET_NAME = 'profile-images'

def convert_to_webp(file):
    img = Image.open(file)
    img = img.convert("RGB")

    buffer = BytesIO()
    img.save(buffer, format='WEBP', quality=80)
    buffer.seek(0)
    return buffer

def upload_image_to_supabase(file):
    filename = f"{uuid.uuid4()}.webp"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"

    optimezed_image = convert_to_webp(file)

    headers = {
        'apikey' : SUPABASE_SERVICE_KEY,
        'Authorization' : f"Bearer {SUPABASE_SERVICE_KEY}",
        'Content-Type' : 'image/webp',
    }

    response = requests.put(upload_url, data=optimezed_image, headers=headers)

    if response.status_code in [200, 201]:
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
        return public_url
    else:
        print('Error al subir la imagen:' , response.text)
        return None