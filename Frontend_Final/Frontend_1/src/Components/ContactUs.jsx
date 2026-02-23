import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-light min-vh-100">
      {/* Header Section */}
      <section
  className="py-5 text-white text-center"
  style={{
    backgroundImage:
      'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("ContactUs.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
  <div className="container">
    <h1 className="fw-bold mb-3">Contact Us</h1>
    <p className="lead">
      Get in touch with us for support, queries, or feedback
    </p>
  </div>
</section>


      {/* Contact Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Contact Info */}
            <div className="col-lg-5">
              <h3 className="fw-bold mb-4">Contact Information</h3>

              <p className="mb-3">
                <strong>Project:</strong> Geo-Based Emergency Alert System
              </p>

              <p className="mb-3">
                <strong>Email:</strong> support@geoemergency.com
              </p>

              <p className="mb-3">
                <strong>Phone:</strong> +91 98765 43210
              </p>

              <p className="mb-3">
                <strong>Address:</strong> Mumbai, Maharashtra, India
              </p>

              <p className="text-muted">
                Our system is designed to help citizens quickly connect with
                nearby police stations and hospitals during emergencies.
              </p>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 p-4">
                <h4 className="fw-bold mb-4">Send Us a Message</h4>

                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
