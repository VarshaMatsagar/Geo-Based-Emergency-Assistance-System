import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-white mb-3">GeoEmergency</h5>
            <p className="text mb-3">Your safety, our priority. Connecting citizens with emergency services instantly.</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-light"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-light"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Services</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text text-decoration-none">Emergency Alert</a></li>
              <li><a href="#" className="text text-decoration-none">Location Tracking</a></li>
              <li><a href="#" className="text text-decoration-none">Police Connect</a></li>
              <li><a href="#" className="text text-decoration-none">Citizen Portal</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/about" className="text text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text text-decoration-none">Contact</a></li>
              <li><a href="#" className="text text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text text-decoration-none">Help Center</a></li>
              <li><a href="#" className="text text-decoration-none">FAQ</a></li>
              <li><a href="#" className="text text-decoration-none">Report Issue</a></li>
              <li><a href="#" className="text text-decoration-none">Emergency: 911</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-white mb-3">Contact Info</h6>
            <div className="text">
              <p><i className="fas fa-map-marker-alt me-2"></i>Mumbai, Maharashtra, India</p>
              <p><i className="fas fa-phone me-2"></i>+91 98765-43210</p>
              <p><i className="fas fa-envelope me-2"></i>support@geoemergency.com</p>
            </div>
          </div>
        </div>
        
        <hr className="my-4 border-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text mb-0">
              © {new Date().getFullYear()} GeoEmergency. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text mb-0">
              Made with ❤️ for public safety
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
