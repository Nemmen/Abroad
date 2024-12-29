import React, { useState } from 'react';

const FileUpload = () => {
  const [folderId, setFolderId] = useState('');
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!folderId || !file) {
      setResponseMessage('Folder ID and file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    try {
      const response = await fetch('https://abroad-backend-ten.vercel.app/api/uploads/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message || 'File uploaded successfully.');
      } else {
        setResponseMessage(data.message || 'Failed to upload file.');
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="folderId">Folder ID:</label>
          <input
            type="text"
            id="folderId"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            required
            placeholder="Enter Google Drive Folder ID"
          />
        </div>

        <div>
          <label htmlFor="file">Choose File:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit">Upload File</button>
      </form>

      {responseMessage && <div id="responseMessage"><p>{responseMessage}</p></div>}
    </div>
  );
};

export default FileUpload;
