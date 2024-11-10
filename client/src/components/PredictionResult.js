import React from 'react';

const PredictionResult = ({ results }) => (
  <div>
    <h3>Prediction Results:</h3>
    <ul>
      {results.map((result, index) => (
        <li key={index}>
          <strong>{result.disease}:</strong> {Math.round(result.confidence * 100)}%
        </li>
      ))}
    </ul>
  </div>
);

export default PredictionResult;
