import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEmergencyById,
  updateEmergencyStatus
} from "../../api/policeApi";

export default function PoliceEmergencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [emergency, setEmergency] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchEmergency();
  }, []);

  const fetchEmergency = async () => {
    try {
      const response = await getEmergencyById(id);
      setEmergency(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching emergency", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateEmergencyStatus(id, status);
      alert("Status updated successfully");
      navigate("/police");
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const openInMaps = (lat, lng) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  if (!emergency) {
    return <p className="text-center mt-5">Loading emergency...</p>;
  }

  return (
    <div className="container mt-4">
      <h3>🚨 Emergency #{emergency.emergencyId}</h3>

      <div className="row">
        <div className="col-md-8">
          <div className="card mt-3">
            <div className="card-header">
              <h5>Emergency Information</h5>
            </div>
            <div className="card-body">
              <p><strong>User:</strong> {emergency.user?.fullName}</p>
              <p><strong>Phone:</strong> {emergency.user?.phoneNumber}</p>
              <p><strong>Type:</strong> {emergency.emergencyType}</p>
              <p><strong>Description:</strong> {emergency.description}</p>
              <p><strong>Status:</strong> {emergency.status}</p>
              <p><strong>Created:</strong> {new Date(emergency.createdAt).toLocaleString()}</p>
              
              {/* Emergency Image Display */}
              {emergency.emergencyType === 'Image' && emergency.emergencyMedias && emergency.emergencyMedias.length > 0 && (
                <div className="mt-3">
                  <p><strong>Emergency Image:</strong></p>
                  <img 
                    src={`data:${emergency.emergencyMedias[0].mediaType};base64,${emergency.emergencyMedias[0].mediaData}`}
                    alt="Emergency"
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px', width: 'auto' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          {/* Assigned Hospital Information */}
          {emergency.assignedHospital && (
            <div className="card mt-3">
              <div className="card-header">
                <h5>🏥 Assigned Hospital</h5>
              </div>
              <div className="card-body">
                <p><strong>Hospital:</strong> {emergency.assignedHospital.name}</p>
                <p><strong>Phone:</strong> {emergency.assignedHospital.phoneNumber}</p>
                <p><strong>Address:</strong><br/>
                <span className="text-muted small">{emergency.assignedHospital.address}</span></p>
                {emergency.assignedHospital.latitude && emergency.assignedHospital.longitude && (
                  <button 
                    className="btn btn-outline-primary btn-sm w-100 mt-2"
                    onClick={() => openInMaps(emergency.assignedHospital.latitude, emergency.assignedHospital.longitude)}
                  >
                    🗺️ View Hospital on Map
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Location Information */}
          <div className="card mt-3">
            <div className="card-header">
              <h5>📍 Citizen Location</h5>
            </div>
            <div className="card-body">
              {emergency.latitude && emergency.longitude ? (
                <div>
                  <p><strong>Coordinates:</strong></p>
                  <p className="text-muted small">
                    Lat: {emergency.latitude.toFixed(6)}<br/>
                    Lng: {emergency.longitude.toFixed(6)}
                  </p>
                  {emergency.address && (
                    <p><strong>Address:</strong><br/>
                    <span className="text-muted">{emergency.address}</span></p>
                  )}
                  <button 
                    className="btn btn-primary btn-sm w-100 mt-2"
                    onClick={() => openInMaps(emergency.latitude, emergency.longitude)}
                  >
                    🗺️ View on Map
                  </button>
                </div>
              ) : (
                <p className="text-muted">Location not available</p>
              )}
            </div>
          </div>
          
          {/* Status Update */}
          <div className="card mt-3">
            <div className="card-header">
              <h5>Update Status</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Accepted">Accepted</option>
                  <option value="OnTheWay">On The Way</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <button
                className="btn btn-success w-100"
                onClick={handleUpdate}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
