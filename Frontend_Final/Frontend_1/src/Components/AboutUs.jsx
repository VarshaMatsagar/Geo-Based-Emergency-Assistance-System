import React from "react";

const AboutUs = () => {

  const teamMembers = [
    {
      id: 1,
      name: "Prem Myana",
      role: "Software Developer",
      image: "Prem.jpeg",
    },
    {
      id: 2,
      name: "Vedant Mali",
      role: "Software Developer",
      image: "Vedant.jpeg",
    },
    {
      id: 3,
      name: "Varsha Matsagar",
      role: "Software Developer",
      image: "Varsha.jpeg",

    },
    {
      id: 4,
      name: "Sofiya Sutar",
      role: "Software Developer",
      image: "Sofiya.jpeg",
    }
  ];

  return (
    <div className="bg-light min-vh-100">

      {/* Hero Section */}
      <section
        className="py-5 text-white"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("AboutUs.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">
            Geo-Based Emergency Alert System
          </h1>
          <p className="lead">
            A smart solution to connect citizens with nearby police stations and hospitals during emergencies.
          </p>
        </div>
      </section>

      {/* About Project */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">🚨 About the Project</h2>
              <p className="lead">
                The Geo-Based Emergency Alert System is designed to provide quick
                assistance during critical situations such as accidents, crimes,
                and medical emergencies.
              </p>
              <p className="lead">
                The system automatically detects the user’s location and sends
                alerts to the nearest police station and hospital, reducing
                response time and saving lives.
              </p>
              <p className="lead">
                This project focuses on public safety, real-time communication,
                and location-based services.
              </p>
            </div>

            <div className="col-lg-6">
              <img
                src="Alert.png"
                alt="Emergency System"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row g-5 text-center">
            <div className="col-lg-6">
              <h3 className="fw-bold mb-3">🎯 Our Mission</h3>
              <p className="lead">
                To provide a fast, reliable, and location-based emergency alert
                system that ensures immediate help from police and hospitals.
              </p>
            </div>

            <div className="col-lg-6">
              <h3 className="fw-bold mb-3">🌍 Our Vision</h3>
              <p className="lead">
                To enhance public safety by leveraging technology for smarter
                emergency response and saving lives.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Meet the Team */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Meet Our Team</h2>
            <p className="lead">
              The team behind the Geo-Based Emergency Alert System
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {teamMembers.map(member => (
              <div key={member.id} className="col-md-3">
                <div className="card border-0 shadow-sm text-center h-100 p-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />

                  <h5 className="fw-bold">{member.name}</h5>
                  <p className="text-primary fw-semibold">{member.role}</p>
                  <p className="text-muted small">{member.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;
