import axios from 'axios';
import React, { useState } from 'react';

function ImageUpload() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/api/user/upload-image', {
      body: formData,
    });

    const data = await response.json();
    alert(data.success ? 'Upload succeeded!' : 'Upload failed');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default ImageUpload;