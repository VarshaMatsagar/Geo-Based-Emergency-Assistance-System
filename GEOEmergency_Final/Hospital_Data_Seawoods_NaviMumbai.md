# Hospital Data for Seawoods, Navi Mumbai

## Database Setup for MSSQL Server

### 1. Hospital Master Data

```sql
-- Insert Hospitals in Seawoods, Navi Mumbai
INSERT INTO Hospitals (Name, Latitude, Longitude, Address, PhoneNumber, IsActive, CreatedAt) VALUES
('Apollo Hospital Navi Mumbai', 19.0330, 73.0297, 'Plot No 13, Parsik Hill Road, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614', '+91-22-39896969', 1, GETDATE()),
('Fortis Hiranandani Hospital', 19.0760, 73.0718, 'Sector 10A, Vashi, Navi Mumbai, Maharashtra 400703', '+91-22-68846800', 1, GETDATE()),
('MGM Hospital Vashi', 19.0728, 73.0037, 'Sector 1, Vashi, Navi Mumbai, Maharashtra 400703', '+91-22-27777999', 1, GETDATE()),
('D Y Patil Hospital', 19.0330, 73.0297, 'Sector 5, Nerul, Navi Mumbai, Maharashtra 400706', '+91-22-39272100', 1, GETDATE()),
('Kokilaben Dhirubhai Ambani Hospital', 19.0896, 73.0553, 'Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West, Mumbai, Maharashtra 400053', '+91-22-42696969', 1, GETDATE()),
('Seawoods Multispeciality Hospital', 19.0196, 73.0553, 'Plot 60, Sector 40A, Seawoods, Navi Mumbai, Maharashtra 400706', '+91-22-27709500', 1, GETDATE()),
('Sterling Hospital Vashi', 19.0760, 73.0037, 'Plot No. 316, Sector 28, Vashi, Navi Mumbai, Maharashtra 400703', '+91-22-27814444', 1, GETDATE()),
('Paramount Hospital', 19.0330, 73.0718, 'Plot No. 47, Sector 35, Kharghar, Navi Mumbai, Maharashtra 410210', '+91-22-27741000', 1, GETDATE());
```

### 2. Hospital Bed Availability Data

```sql
-- Insert Hospital Bed Data
INSERT INTO HospitalBeds (HospitalId, TotalBeds, AvailableBeds, LastUpdated) VALUES
(1, 350, 45, GETDATE()),  -- Apollo Hospital - 45 available beds
(2, 280, 32, GETDATE()),  -- Fortis Hiranandani - 32 available beds  
(3, 200, 18, GETDATE()),  -- MGM Hospital - 18 available beds
(4, 400, 55, GETDATE()),  -- D Y Patil Hospital - 55 available beds
(5, 750, 0, GETDATE()),   -- Kokilaben Hospital - No available beds
(6, 150, 22, GETDATE()),  -- Seawoods Multispeciality - 22 available beds
(7, 180, 15, GETDATE()),  -- Sterling Hospital - 15 available beds
(8, 220, 28, GETDATE());  -- Paramount Hospital - 28 available beds
```

### 3. Query to Fetch All Hospital Data

```sql
-- Get all hospitals with bed availability
SELECT 
    h.HospitalId,
    h.Name,
    h.Latitude,
    h.Longitude,
    h.Address,
    h.PhoneNumber,
    h.IsActive,
    hb.TotalBeds,
    hb.AvailableBeds,
    hb.LastUpdated
FROM Hospitals h
LEFT JOIN HospitalBeds hb ON h.HospitalId = hb.HospitalId
WHERE h.IsActive = 1
ORDER BY h.Name;
```

### 4. Query to Find Nearest Hospitals with Available Beds

```sql
-- Get hospitals with available beds only
SELECT 
    h.HospitalId,
    h.Name,
    h.Latitude,
    h.Longitude,
    h.Address,
    h.PhoneNumber,
    hb.AvailableBeds
FROM Hospitals h
INNER JOIN HospitalBeds hb ON h.HospitalId = hb.HospitalId
WHERE h.IsActive = 1 AND hb.AvailableBeds > 0
ORDER BY hb.AvailableBeds DESC;
```

### 5. Update Bed Availability

```sql
-- Update bed availability (when emergency is assigned)
UPDATE HospitalBeds 
SET AvailableBeds = AvailableBeds - 1, 
    LastUpdated = GETDATE()
WHERE HospitalId = @HospitalId AND AvailableBeds > 0;

-- Release bed (when emergency is resolved/rejected)
UPDATE HospitalBeds 
SET AvailableBeds = AvailableBeds + 1, 
    LastUpdated = GETDATE()
WHERE HospitalId = @HospitalId;
```

### 6. Geographic Coverage Area

**Seawoods, Navi Mumbai Coordinates:**
- **Central Point**: 19.0196° N, 73.0553° E
- **Coverage Radius**: ~10 km from Seawoods
- **Areas Covered**: Vashi, Nerul, CBD Belapur, Kharghar, Palm Beach Road

### 7. Hospital Specializations

| Hospital | Specialization | Emergency Services |
|----------|---------------|-------------------|
| Apollo Hospital | Multi-specialty, Cardiac | 24/7 Emergency |
| Fortis Hiranandani | Multi-specialty, Oncology | 24/7 Trauma Center |
| MGM Hospital | General Medicine, Surgery | Emergency Ward |
| D Y Patil Hospital | Multi-specialty, Orthopedics | 24/7 Emergency |
| Kokilaben Hospital | Super-specialty, Neurology | Advanced Trauma |
| Seawoods Multispeciality | General, Pediatrics | Emergency Services |
| Sterling Hospital | Multi-specialty | Emergency Care |
| Paramount Hospital | General, Maternity | Emergency Ward |

### 8. Testing Queries

```sql
-- Test emergency assignment logic
DECLARE @EmergencyLat FLOAT = 19.0196; -- Seawoods coordinates
DECLARE @EmergencyLng FLOAT = 73.0553;

-- This would be replaced by Google Maps API distance calculation
SELECT TOP 1
    h.HospitalId,
    h.Name,
    h.Latitude,
    h.Longitude,
    hb.AvailableBeds,
    -- Simple distance calculation (replace with Google Maps API)
    SQRT(POWER(h.Latitude - @EmergencyLat, 2) + POWER(h.Longitude - @EmergencyLng, 2)) as ApproxDistance
FROM Hospitals h
INNER JOIN HospitalBeds hb ON h.HospitalId = hb.HospitalId
WHERE h.IsActive = 1 AND hb.AvailableBeds > 0
ORDER BY ApproxDistance ASC;
```

### 9. Database Connection String

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=GeoEmergencyDB;Trusted_Connection=True;"
  }
}
```

### 10. Entity Framework Migration Commands

```bash
# Add migration for hospital tables
dotnet ef migrations add AddHospitalTables

# Update database
dotnet ef database update

# Run the hospital data insert scripts in SQL Server Management Studio
```

**Note**: After running the migration, execute the INSERT statements above in SQL Server Management Studio or through Entity Framework to populate the hospital data.