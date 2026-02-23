-- Sample Hospital Data for Testing
-- Run this after applying the migration

-- Insert sample hospitals
INSERT INTO Hospitals (Name, Latitude, Longitude, Address, PhoneNumber, IsActive, CreatedAt) VALUES
('City General Hospital', 18.5204, 73.8567, '123 Main Street, Pune', '+91-20-12345678', 1, GETDATE()),
('Metro Medical Center', 18.5314, 73.8446, '456 Park Avenue, Pune', '+91-20-87654321', 1, GETDATE()),
('Central Care Hospital', 18.5074, 73.8077, '789 Health Road, Pune', '+91-20-11223344', 1, GETDATE()),
('Emergency Medical Hub', 18.4649, 73.8803, '321 Emergency Lane, Pune', '+91-20-99887766', 1, GETDATE()),
('Sunrise Hospital', 18.5642, 73.7769, '654 Sunrise Blvd, Pune', '+91-20-55443322', 1, GETDATE());

-- Insert bed availability data
INSERT INTO HospitalBeds (HospitalId, TotalBeds, AvailableBeds, LastUpdated) VALUES
(1, 150, 25, GETDATE()),  -- City General Hospital - 25 available beds
(2, 200, 0, GETDATE()),   -- Metro Medical Center - No available beds
(3, 120, 15, GETDATE()),  -- Central Care Hospital - 15 available beds
(4, 180, 40, GETDATE()),  -- Emergency Medical Hub - 40 available beds
(5, 100, 8, GETDATE());   -- Sunrise Hospital - 8 available beds

-- Note: Replace the HospitalId values with actual IDs from your database after running the migration