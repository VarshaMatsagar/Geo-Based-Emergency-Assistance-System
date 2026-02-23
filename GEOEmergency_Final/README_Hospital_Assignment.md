# Geo-Based Emergency Assistance System

## Overview

This system automatically assigns emergencies to the nearest available hospital based on **road distance** (not straight-line distance) using Google Maps Distance Matrix API, with fallback to Haversine formula calculation.

## Key Features

✅ **Automatic Hospital Assignment**: Finds nearest hospital with available beds  
✅ **Road Distance Calculation**: Uses Google Maps API for accurate driving distances  
✅ **Bed Availability Management**: Tracks and validates hospital bed availability  
✅ **Emergency Redirection**: Automatically redirects to next nearest hospital if rejected  
✅ **Fallback Mechanism**: Uses Haversine formula if Google Maps API fails  
✅ **Clean Architecture**: Layered architecture with Controllers, Services, and Repositories  

## Database Schema

### New Tables Added

```sql
-- Hospital master data
CREATE TABLE Hospitals (
    HospitalId INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(200) NOT NULL,
    Latitude FLOAT NOT NULL,
    Longitude FLOAT NOT NULL,
    Address NVARCHAR(500),
    PhoneNumber NVARCHAR(20),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Hospital bed availability
CREATE TABLE HospitalBeds (
    HospitalBedsId INT PRIMARY KEY IDENTITY,
    HospitalId INT FOREIGN KEY REFERENCES Hospitals(HospitalId),
    TotalBeds INT NOT NULL,
    AvailableBeds INT NOT NULL,
    LastUpdated DATETIME2 DEFAULT GETDATE()
);

-- Updated Emergency table
ALTER TABLE Emergencies ADD AssignedHospitalId INT NULL;
ALTER TABLE Emergencies ADD FOREIGN KEY (AssignedHospitalId) REFERENCES Hospitals(HospitalId);
```

## API Endpoints

### 1. Create Emergency (Auto-Assignment)
```http
POST /api/emergencies
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "description": "Medical emergency - chest pain",
  "targetDepartment": "HOSPITAL", // or "BOTH"
  "latitude": 18.5204,
  "longitude": 73.8567,
  "address": "123 Main Street, Pune"
}
```

**Response:**
```json
{
  "emergencyId": 123,
  "assignedHospitalId": 1,
  "assignedHospitalName": "City General Hospital",
  "status": "Assigned",
  "message": "Emergency assigned to City General Hospital (2.5 km away)"
}
```

### 2. Get Hospital Assigned Emergencies
```http
GET /api/hospital/emergencies
Authorization: Bearer {hospital_jwt_token}
```

### 3. Reject Emergency (Triggers Redirection)
```http
POST /api/hospital/emergencies/{id}/reject
Authorization: Bearer {hospital_jwt_token}
Content-Type: application/json

{
  "reason": "No available beds"
}
```

### 4. Get Nearest Hospitals
```http
GET /api/emergencies/nearest-hospitals?latitude=18.5204&longitude=73.8567
Authorization: Bearer {jwt_token}
```

## Service Layer Architecture

### 1. Distance Calculation Service
```csharp
public interface IDistanceCalculationService
{
    Task<List<HospitalDistanceDTO>> CalculateDistancesToHospitalsAsync(
        double originLat, double originLng, List<Hospital> hospitals);
    double CalculateHaversineDistance(double lat1, double lng1, double lat2, double lng2);
}
```

**Features:**
- Google Distance Matrix API integration
- Automatic fallback to Haversine calculation
- Batch distance calculation for multiple hospitals
- Error handling and retry logic

### 2. Hospital Assignment Service
```csharp
public interface IHospitalAssignmentService
{
    Task<EmergencyAssignmentResponseDTO> AssignNearestAvailableHospitalAsync(Emergency emergency);
    Task<EmergencyAssignmentResponseDTO> RedirectToNextAvailableHospitalAsync(int emergencyId);
    Task<List<HospitalDistanceDTO>> GetNearestHospitalsAsync(double latitude, double longitude);
}
```

**Features:**
- Finds nearest hospital with available beds
- Automatically reserves bed upon assignment
- Handles emergency redirection
- Releases beds when emergency is rejected

## Emergency Assignment Flow

```
1. Citizen creates emergency with location
   ↓
2. System fetches all active hospitals
   ↓
3. Calculate distances using Google Maps API
   ↓ (fallback if API fails)
4. Calculate distances using Haversine formula
   ↓
5. Sort hospitals by distance
   ↓
6. Find first hospital with available beds
   ↓
7. Assign emergency & reserve bed
   ↓
8. Return assignment response
```

## Redirection Flow

```
1. Hospital rejects emergency
   ↓
2. Release bed from current hospital
   ↓
3. Mark emergency as "REDIRECTED"
   ↓
4. Re-run assignment logic for remaining hospitals
   ↓
5. Assign to next nearest available hospital
```

## Configuration

### 1. Google Maps API Setup
```json
// appsettings.json
{
  "GoogleMaps": {
    "ApiKey": "YOUR_GOOGLE_MAPS_API_KEY_HERE"
  }
}
```

### 2. Environment Variables (Recommended)
```bash
# For production, use environment variables
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Azure Key Vault (Production)
```csharp
// Program.cs - for production
builder.Configuration.AddAzureKeyVault(
    new Uri("https://your-keyvault.vault.azure.net/"),
    new DefaultAzureCredential());
```

## Security Best Practices

### 1. API Key Security
- ✅ Store in environment variables
- ✅ Use Azure Key Vault for production
- ✅ Restrict API key to specific domains/IPs
- ✅ Enable API key restrictions in Google Cloud Console

### 2. JWT Authentication
- ✅ Role-based authorization (Citizen, Hospital, Admin)
- ✅ Secure JWT secret key
- ✅ Token expiration handling

## Testing the System

### 1. Setup Sample Data
```sql
-- Run the SampleData.sql script to populate test hospitals
```

### 2. Test Emergency Creation
```bash
# Create emergency for hospital assignment
curl -X POST "https://localhost:7000/api/emergencies" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Medical emergency",
    "targetDepartment": "HOSPITAL",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "address": "Test Location"
  }'
```

### 3. Test Hospital Rejection
```bash
# Hospital rejects emergency (triggers redirection)
curl -X POST "https://localhost:7000/api/hospital/emergencies/123/reject" \
  -H "Authorization: Bearer HOSPITAL_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "No available beds"}'
```

## Error Handling

### 1. Google Maps API Failures
- Automatic fallback to Haversine calculation
- Logging of API failures
- Graceful degradation

### 2. No Available Hospitals
- Returns appropriate error message
- Suggests contacting emergency services directly

### 3. Database Failures
- Transaction rollback for bed reservations
- Proper error logging and monitoring

## Performance Considerations

### 1. Caching
- Consider caching hospital data for frequently accessed locations
- Cache Google Maps API responses for short periods

### 2. Batch Processing
- Single API call for multiple hospital distances
- Efficient database queries with proper indexing

### 3. Scalability
- Async/await throughout the application
- Connection pooling for database access
- Rate limiting for API endpoints

## Monitoring and Logging

### 1. Key Metrics to Monitor
- Emergency assignment success rate
- Average response time for hospital assignment
- Google Maps API usage and failures
- Hospital bed availability trends

### 2. Logging
- All emergency assignments and redirections
- API failures and fallback usage
- Performance metrics for distance calculations

## Deployment Checklist

- [ ] Configure Google Maps API key securely
- [ ] Run database migrations
- [ ] Populate sample hospital data
- [ ] Test emergency assignment flow
- [ ] Test hospital rejection and redirection
- [ ] Verify fallback mechanism works
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Test with real GPS coordinates

## Future Enhancements

1. **Real-time Bed Updates**: WebSocket integration for live bed availability
2. **Traffic-aware Routing**: Consider real-time traffic in distance calculations
3. **Hospital Specialization**: Match emergency type with hospital capabilities
4. **Ambulance Dispatch**: Integration with ambulance services
5. **Predictive Analytics**: ML models for bed availability prediction
6. **Mobile App Integration**: Real-time location tracking
7. **Multi-language Support**: Localization for different regions

## Support

For technical support or questions about the implementation, please refer to the API documentation or contact the development team.