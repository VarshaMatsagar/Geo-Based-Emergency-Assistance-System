import React, { useEffect, useState } from "react";
import { getAllEmergencies } from "../../api/policeApi";
import { useNavigate } from "react-router-dom";

export default function PoliceDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await getAllEmergencies();
      setEmergencies(response.data);
    } catch (error) {
      console.error("Error fetching emergencies", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (lat, lng) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading emergencies...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🚓 Active Emergencies</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {emergencies.map((e) => (
            <tr key={e.emergencyId}>
              <td>{e.emergencyId}</td>
              <td>{e.user?.fullName}</td>
              <td>{e.emergencyType}</td>
              <td>
                {e.latitude && e.longitude ? (
                  <div>
                    <small className="text-muted d-block">
                      📍 {e.latitude.toFixed(4)}, {e.longitude.toFixed(4)}
                    </small>
                    <button 
                      className="btn btn-sm btn-outline-primary mt-1"
                      onClick={() => openInMaps(e.latitude, e.longitude)}
                    >
                      View on Map
                    </button>
                  </div>
                ) : (
                  <span className="text-muted">Location unavailable</span>
                )}
              </td>
              <td>
                <span className="badge bg-warning text-dark">
                  {e.status}
                </span>
              </td>
              <td>{new Date(e.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    navigate(`/police/emergency/${e.emergencyId}`)
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
