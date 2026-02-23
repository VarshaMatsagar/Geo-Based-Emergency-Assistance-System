export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Try to get address from coordinates
        try {
          const address = await getAddressFromCoordinates(location.latitude, location.longitude);
          location.address = address;
        } catch (error) {
          console.log('Could not get address:', error);
        }
        
        resolve(location);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

// Get address from coordinates using reverse geocoding
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY&limit=1`
    );
    
    if (!response.ok) {
      // Fallback to a simple format if API fails
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted;
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};