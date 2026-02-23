import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyForm = () => {
    const [formData, setFormData] = useState({
        message: '',
        image: null,
        latitude: 0,
        longitude: 0,
        targetDepartment: 'HOSPITAL',
        isPanic: false
    });
    const [loading, setLoading] = useState(false);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                },
                (error) => {
                    setLocationError('Unable to get location. Please enable location services.');
                }
            );
        }
    }, []);

    const testConnection = async () => {
        try {
            const response = await axios.get('https://localhost:7075/api/Test');
            alert('✅ Connection successful: ' + response.data.message);
        } catch (error) {
            alert('❌ Connection error: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://localhost:7075/api/Citizen/emergency/message', {
                description: formData.message
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('Emergency reported successfully!');
            setFormData({
                message: '',
                image: null,
                latitude: formData.latitude,
                longitude: formData.longitude,
                targetDepartment: 'HOSPITAL',
                isPanic: false
            });
        } catch (error) {
            if (error.response?.status === 401) {
                alert('Authentication failed. Please login again.');
            } else {
                alert('Error reporting emergency: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePanicButton = async () => {
        if (!confirm('Are you sure you want to activate the PANIC BUTTON?')) {
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Get current location
            let locationData = {};
            if (navigator.geolocation) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                } catch (locationError) {
                    console.log('Location unavailable:', locationError);
                }
            }
            
            await axios.post('https://localhost:7075/api/Citizen/emergency/alert', locationData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('PANIC ALERT SENT!');
        } catch (error) {
            if (error.response?.status === 401) {
                alert('Authentication failed. Please login again.');
            } else {
                alert('Error sending panic alert: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="emergency-form-container">
            <h2>Report Emergency</h2>
            
            <button onClick={testConnection} style={{marginBottom: '10px', backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px'}}>
                Test Connection
            </button>
            
            {locationError && (
                <div className="alert alert-warning">{locationError}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Emergency Message:</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Describe your emergency..."
                    />
                </div>

                <div className="form-group">
                    <label>Upload Image (Optional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label>Send Emergency To:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="targetDepartment"
                                value="HOSPITAL"
                                checked={formData.targetDepartment === 'HOSPITAL'}
                                onChange={handleInputChange}
                            />
                            Hospital Only
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="targetDepartment"
                                value="POLICE"
                                checked={formData.targetDepartment === 'POLICE'}
                                onChange={handleInputChange}
                            />
                            Police Only
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="targetDepartment"
                                value="BOTH"
                                checked={formData.targetDepartment === 'BOTH'}
                                onChange={handleInputChange}
                            />
                            Both Hospital & Police
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <p>Location: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                </div>

                <div className="button-group">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Sending...' : 'Report Emergency'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handlePanicButton} 
                        disabled={loading}
                        className="btn-panic"
                    >
                        🚨 PANIC BUTTON 🚨
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmergencyForm;