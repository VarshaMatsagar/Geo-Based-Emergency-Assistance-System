import React from "react";

export default function Dashboard() {
    return (
        <div className="container-fluid bg-light py-5 px-5">
  
  <div className="text-center mb-4">
    <h2 className="text-danger fw-bold">
      🚨 Geo-Based Emergency Assistance System
    </h2>
    <p className="text-muted">
      A quick-response platform to help citizens during accidents,
      assaults, and medical emergencies.
    </p>
  </div>

  <div className="row g-4">
    <div className="col-md-6">
      <div className="card shadow h-100">
        <div className="card-body">
          <h5 className="text-danger">🚨 Emergency SOS Feature</h5>
          <p className="text-muted">
            Allows citizens to instantly request help by sharing
            real-time location with police and hospitals.
          </p>
        </div>
      </div>
    </div>

    <div className="col-md-6">
      <div className="card shadow h-100">
        <div className="card-body">
          <h5 className="text-primary">📍 Geo-Location Tracking</h5>
          <p className="text-muted">
            Identifies the exact location of the citizen during
            emergencies to ensure quick response.
          </p>
        </div>
      </div>
    </div>

    <div className="col-md-6">
      <div className="card shadow h-100">
        <div className="card-body">
          <h5 className="text-success">📸 Incident Photo Reporting</h5>
          <p className="text-muted">
            Allows citizens to upload photos of accidents or crime
            scenes for better understanding by authorities.
          </p>
        </div>
      </div>
    </div>

    <div className="col-md-6">
      <div className="card shadow h-100">
        <div className="card-body">
          <h5 className="text-warning">✍️ Emergency Message Communication</h5>
          <p className="text-muted">
            Enables citizens to describe emergencies in their own
            words for accurate assistance.
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Summary */}
                <div className="mt-5 text-center">
                    <p className="text-muted">
                        The GeoEmergency system is designed to reduce response time,
                        improve coordination between citizens and authorities, and
                        enhance public safety using modern geo-based technologies.
                    </p>
                </div>
  </div>

</div>

    );
}
