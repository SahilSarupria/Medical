import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null); // For holding the selected image
  const [prediction, setPrediction] = useState(null); // For holding the prediction results
  const [loading, setLoading] = useState(false); // For showing loading state

  // Handle file input change
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle form submission and make the API call to the Flask backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert("Please upload an image");
      return;
    }

    setLoading(true); // Show loading state

    // Create a new FormData object and append the file
    const formData = new FormData();
    formData.append('file', image);

    try {
      // Send the file to the Flask backend API
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        body: formData,
      });

      // Parse the JSON response
      const result = await response.json();
      console.log(result);  // Log the result to verify the API response
      setPrediction(result); // Set the prediction results

    } catch (error) {
      console.error("Error during API call:", error);
      alert("There was an error with the prediction.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="App">
      <h1>Medical Image Classification</h1>

      {/* Form for uploading image */}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload Image"}
        </button>
      </form>

      {/* Display prediction results */}
      {prediction && (
        <div>
          <h2>Prediction Results:</h2>
          {prediction.map((item, index) => (
            <p key={index}>
              <strong>{item.disease}:</strong> {item.confidence.toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
