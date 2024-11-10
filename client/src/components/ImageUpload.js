import React, { useState } from 'react';
import { predictImage } from '../api/predict';
import PredictionResult from './PredictionResult';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const predictionResults = await predictImage(file);
      setResults(predictionResults);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Predict</button>
      </form>
      {results && <PredictionResult results={results} />}
    </div>
  );
};

export default ImageUpload;
