import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmergencyById, updateEmergencyStatus } from "../../api/hospitalApi";

export default function HospitalEmergencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyDetail();
  }, [id]);

  const fetchEmergencyDetail = async () => {
    try {
      const response = await getEmergencyById(id);
      setEmergency(response.data);
    } catch (error) {
      console.error("Error fetching emergency detail", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateEmergencyStatus(id, newStatus);
      setEmergency({ ...emergency, status: newStatus });
      alert(`Status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  const openInMaps = (lat, lng) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading emergency details...</p>;
  }

  if (!emergency) {
    return <p className="text-center mt-5">Emergency not found</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>🏥 Emergency Details - ID: {emergency.emergencyId}</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3"><strong>Type:</strong></div>
                <div className="col-sm-9">{emergency.emergencyType}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3"><strong>Description:</strong></div>
                <div className="col-sm-9">{emergency.description}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3"><strong>Status:</strong></div>
                <div className="col-sm-9">
                  <span className="badge bg-warning text-dark">
                    {emergency.status}
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3"><strong>Created:</strong></div>
                <div className="col-sm-9">
                  {new Date(emergency.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3"><strong>Citizen:</strong></div>
                <div className="col-sm-9">{emergency.user?.fullName}</div>
              </div>
              
              {/* Emergency Image Display */}
              {emergency.emergencyType === 'Image' && emergency.emergencyMedias && emergency.emergencyMedias.length > 0 && (
                <div className="row mb-3">
                  <div className="col-sm-3"><strong>Emergency Image:</strong></div>
                  <div className="col-sm-9">
                    <img 
                      src={`data:${emergency.emergencyMedias[0].mediaType};base64,${emergency.emergencyMedias[0].mediaData}`}
                      alt="Emergency"
                      className="img-fluid rounded"
                      style={{ maxHeight: '300px', width: 'auto' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Assigned Hospital Information */}
          {emergency.assignedHospital && (
            <div className="card mb-3">
              <div className="card-header">
                <h5>🏥 Assigned Hospital</h5>
              </div>
              <div className="card-body">
                <h6 className="card-title">{emergency.assignedHospital.name}</h6>
                <p className="card-text">
                  <strong>Address:</strong><br/>
                  <span className="text-muted">{emergency.assignedHospital.address}</span>
                </p>
                <p className="card-text">
                  <strong>Phone:</strong> {emergency.assignedHospital.phoneNumber}
                </p>
                <p className="card-text">
                  <strong>Location:</strong><br/>
                  <span className="text-muted small">
                    Lat: {emergency.assignedHospital.latitude.toFixed(6)}<br/>
                    Lng: {emergency.assignedHospital.longitude.toFixed(6)}
                  </span>
                </p>
                {emergency.assignedHospital.hospitalBeds && (
                  <p className="card-text">
                    <strong>Bed Availability:</strong><br/>
                    <span className="badge bg-info">
                      {emergency.assignedHospital.hospitalBeds.availableBeds} / {emergency.assignedHospital.hospitalBeds.totalBeds} Available
                    </span>
                  </p>
                )}
                <button 
                  className="btn btn-primary btn-sm w-100 mt-2"
                  onClick={() => openInMaps(emergency.assignedHospital.latitude, emergency.assignedHospital.longitude)}
                >
                  🗺️ View Hospital on Map
                </button>
              </div>
            </div>
          )}

          {/* Location Information */}
          <div className="card mb-3">
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
          
          <div className="card">
            <div className="card-header">
              <h5>Update Status</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate("Accepted")}
                  disabled={emergency.status === "Accepted"}
                >
                  Accept Emergency
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleStatusUpdate("OnTheWay")}
                  disabled={emergency.status === "OnTheWay"}
                >
                  On The Way
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleStatusUpdate("Resolved")}
                  disabled={emergency.status === "Resolved"}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-secondary w-100"
              onClick={() => navigate("/hospital")}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}