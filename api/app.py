from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import io
from flask_cors import CORS  # Import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
model = tf.keras.models.load_model('model/trained_model.h5')

# Define disease classes
disease_classes = [ 'Normal','Pneumonia',]

# Preprocess the image
def preprocess_image(image):
    # Convert image to RGB if it's in RGBA or grayscale
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to the model's expected input dimensions
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0  # Normalize the image
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

# Prediction endpoint
@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    image = Image.open(io.BytesIO(file.read()))
    processed_image = preprocess_image(image)

    # Make prediction
    predictions = model.predict(processed_image)[0]  # Assuming predictions is a 1D array of probabilities
    print("Raw predictions:", predictions)

    predicted_class_index = np.argmax(predictions)
    predicted_class_confidence = predictions[predicted_class_index]

    # Prepare response with top n results
    print(f"Predicted class: {disease_classes[predicted_class_index]}")
    print(f"Confidence: {predicted_class_confidence}")
    results = [
        {'disease': disease_classes[i], 'confidence': float(predictions[i])}
        for i in range(len(disease_classes))
    ]
    # Sort results by confidence in descending order
    results = sorted(results, key=lambda x: x['confidence'], reverse=True)

    # Optionally, limit to top n results (e.g., top 3)
    top_n_results = results[:1]
    print("Prediction results:", top_n_results)  # Debugging output
    return jsonify(top_n_results)

if __name__ == '__main__':
    app.run(debug=True)
