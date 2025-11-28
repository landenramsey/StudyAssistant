import { useState } from 'react';
import { uploadDocument } from '../services/api';
import './DocumentUpload.css';

function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await uploadDocument(file);
      setResult(response);
      onUpload(response);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <h2>Upload Study Materials</h2>
      <p>Upload PDFs, Word documents, or text files to build your knowledge base.</p>

      <div className="upload-area">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="success">
          <h3>✅ Document uploaded successfully!</h3>
          <p>Filename: {result.filename}</p>
          <p>Chunks processed: {result.chunks_count}</p>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;

