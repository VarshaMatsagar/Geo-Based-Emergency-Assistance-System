import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthenticatedImage = ({ src, alt, className, style, onError }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(src, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        });
        
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(true);
        setLoading(false);
        if (onError) onError(err);
      }
    };

    if (src) {
      fetchImage();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (loading) {
    return <div className="text-muted">Loading image...</div>;
  }

  if (error || !imageSrc) {
    return <div className="text-muted">Image not available</div>;
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className} 
      style={style}
      onError={() => setError(true)}
    />
  );
};

export default AuthenticatedImage;