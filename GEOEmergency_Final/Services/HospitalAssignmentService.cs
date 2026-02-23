using GEOEmergency.API.Models;
using GEOEmergency.Data;
using GEOEmergency.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GEOEmergency.Services
{
    public interface IHospitalAssignmentService
    {
        Task<EmergencyAssignmentResponseDTO> AssignNearestAvailableHospitalAsync(Emergency emergency);
        Task<EmergencyAssignmentResponseDTO> RedirectToNextAvailableHospitalAsync(int emergencyId);
        Task<List<HospitalDistanceDTO>> GetNearestHospitalsAsync(double latitude, double longitude);
    }

    public class HospitalAssignmentService : IHospitalAssignmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IDistanceCalculationService _distanceService;
        private readonly ILogger<HospitalAssignmentService> _logger;

        public HospitalAssignmentService(
            ApplicationDbContext context,
            IDistanceCalculationService distanceService,
            ILogger<HospitalAssignmentService> logger)
        {
            _context = context;
            _distanceService = distanceService;
            _logger = logger;
        }

        public async Task<EmergencyAssignmentResponseDTO> AssignNearestAvailableHospitalAsync(Emergency emergency)
        {
            if (!emergency.Latitude.HasValue || !emergency.Longitude.HasValue)
            {
                return new EmergencyAssignmentResponseDTO
                {
                    EmergencyId = emergency.EmergencyId,
                    Status = "Failed",
                    Message = "Emergency location coordinates are required for hospital assignment"
                };
            }

            _logger.LogInformation($"Starting hospital assignment for Emergency {emergency.EmergencyId} at location ({emergency.Latitude}, {emergency.Longitude})");

            // Get all active hospitals with bed information
            var hospitals = await _context.Hospitals
                .Include(h => h.HospitalBeds)
                .Where(h => h.IsActive)
                .ToListAsync();

            _logger.LogInformation($"Found {hospitals.Count} active hospitals");

            if (!hospitals.Any())
            {
                return new EmergencyAssignmentResponseDTO
                {
                    EmergencyId = emergency.EmergencyId,
                    Status = "Failed",
                    Message = "No active hospitals found in the system"
                };
            }

            // Calculate distances to all hospitals using Google Maps API
            var hospitalDistances = await _distanceService.CalculateDistancesToHospitalsAsync(
                emergency.Latitude.Value, emergency.Longitude.Value, hospitals);

            // Log distance calculation results
            foreach (var hospital in hospitalDistances)
            {
                _logger.LogInformation($"Hospital: {hospital.HospitalName}, Distance: {hospital.DistanceInKm:F2} km, Available Beds: {hospital.AvailableBeds}");
            }

            // Find the nearest hospital with available beds
            var assignedHospital = hospitalDistances
                .Where(h => h.AvailableBeds > 0)
                .OrderBy(h => h.DistanceInKm)
                .FirstOrDefault();

            if (assignedHospital == null)
            {
                _logger.LogWarning($"No hospitals with available beds found for Emergency {emergency.EmergencyId}");
                return new EmergencyAssignmentResponseDTO
                {
                    EmergencyId = emergency.EmergencyId,
                    Status = "Failed",
                    Message = "No hospitals with available beds found"
                };
            }

            _logger.LogInformation($"Selected nearest hospital: {assignedHospital.HospitalName} at {assignedHospital.DistanceInKm:F2} km");

            // Assign hospital to emergency
            emergency.AssignedHospitalId = assignedHospital.HospitalId;
            emergency.Status = "Assigned";

            // Update bed availability (reserve one bed)
            var hospitalBeds = await _context.HospitalBeds
                .FirstOrDefaultAsync(hb => hb.HospitalId == assignedHospital.HospitalId);

            if (hospitalBeds != null && hospitalBeds.AvailableBeds > 0)
            {
                hospitalBeds.AvailableBeds--;
                hospitalBeds.LastUpdated = DateTime.Now;
                _logger.LogInformation($"Reserved bed at {assignedHospital.HospitalName}. Remaining beds: {hospitalBeds.AvailableBeds}");
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Emergency {emergency.EmergencyId} successfully assigned to hospital {assignedHospital.HospitalName} (Distance: {assignedHospital.DistanceInKm:F2} km)");

            return new EmergencyAssignmentResponseDTO
            {
                EmergencyId = emergency.EmergencyId,
                AssignedHospitalId = assignedHospital.HospitalId,
                AssignedHospitalName = assignedHospital.HospitalName,
                Status = "Assigned",
                Message = $"Emergency assigned to {assignedHospital.HospitalName} ({assignedHospital.DistanceInKm:F2} km away)"
            };
        }

        public async Task<EmergencyAssignmentResponseDTO> RedirectToNextAvailableHospitalAsync(int emergencyId)
        {
            var emergency = await _context.Emergencies
                .Include(e => e.AssignedHospital)
                .FirstOrDefaultAsync(e => e.EmergencyId == emergencyId);

            if (emergency == null)
            {
                return new EmergencyAssignmentResponseDTO
                {
                    EmergencyId = emergencyId,
                    Status = "Failed",
                    Message = "Emergency not found"
                };
            }

            // Release the bed from the previous hospital
            if (emergency.AssignedHospitalId.HasValue)
            {
                var previousHospitalBeds = await _context.HospitalBeds
                    .FirstOrDefaultAsync(hb => hb.HospitalId == emergency.AssignedHospitalId.Value);

                if (previousHospitalBeds != null)
                {
                    previousHospitalBeds.AvailableBeds++;
                    previousHospitalBeds.LastUpdated = DateTime.Now;
                }
            }

            // Update emergency status
            emergency.Status = "REDIRECTED";
            emergency.AssignedHospitalId = null;

            await _context.SaveChangesAsync();

            // Find next available hospital
            return await AssignNearestAvailableHospitalAsync(emergency);
        }

        public async Task<List<HospitalDistanceDTO>> GetNearestHospitalsAsync(double latitude, double longitude)
        {
            var hospitals = await _context.Hospitals
                .Include(h => h.HospitalBeds)
                .Where(h => h.IsActive)
                .ToListAsync();

            return await _distanceService.CalculateDistancesToHospitalsAsync(latitude, longitude, hospitals);
        }
    }
}