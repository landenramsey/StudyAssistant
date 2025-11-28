import { useState } from 'react';
import { uploadDocument } from '../services/api';
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import './DocumentUpload.css';

function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const response = await uploadDocument(file);
      setResult(response);
      onUpload(response);
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      if (err.message && err.message.includes('Cannot connect')) {
        setError('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
      } else {
        setError(err.response?.data?.detail || err.message || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <div className="section-header">
        <FiFile className="section-icon" />
        <h2>Upload Study Materials</h2>
      </div>
      <p className="section-description">
        Upload your PDFs, Word documents, or text files to build your knowledge base. 
        Once uploaded, you can ask questions, generate quizzes, and create flashcards.
      </p>

      <div className="upload-area">
        <div className="upload-icon-wrapper">
          <FiUpload className="upload-icon" />
        </div>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading}
          id="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          {file ? file.name : 'Choose a file'}
        </label>
        <button 
          onClick={handleUpload} 
          disabled={uploading || !file}
          className="upload-button"
        >
          {uploading ? (
            <>
              <FiLoader className="button-icon spinning" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiUpload className="button-icon" />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <FiAlertCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="success-message">
          <FiCheckCircle className="success-icon" />
          <div className="success-content">
            <h3>Document uploaded successfully!</h3>
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Filename:</span>
                <span className="detail-value">{result.filename}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Chunks processed:</span>
                <span className="detail-value">{result.chunks_count}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
