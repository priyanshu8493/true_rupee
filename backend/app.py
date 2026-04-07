import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
TEMP_FOLDER = 'temp_uploads'
MODEL_PATH = 'indian_currency_detector.keras'

if not os.path.exists(TEMP_FOLDER):
    os.makedirs(TEMP_FOLDER)

print("Loading model...")
import tensorflow as tf
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("Model loaded successfully!")

keras = tf.keras


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def predict_currency(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    
    prediction = model.predict(img_array, verbose=0)[0][0]
    print(f"RAW MODEL PREDICTION SCORE: {prediction}")
    
    if prediction > 0.85:
        return {"class": "Real", "confidence": float(round(prediction, 4))}
    else:
        return {"class": "Fake", "confidence": float(round(1 - prediction, 4))}


@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Please upload an image file."}), 400
    
    filename = secure_filename(file.filename)
    temp_path = os.path.join(TEMP_FOLDER, filename)
    
    try:
        file.save(temp_path)
        result = predict_currency(temp_path)
        return jsonify({"success": True, "prediction": result}), 200
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "TrueRupee API"}), 200


if __name__ == '__main__':
    print("Starting TrueRupee API Server...")
    print("Backend running on http://localhost:8000")
    app.run(debug=True, host='0.0.0.0', port=8000)
