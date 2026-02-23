using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GEOEmergency.Data;
using GEOEmergency.API.Models;
using GEOEmergency.DTOs;
using GEOEmergency.Services;
using Microsoft.AspNetCore.Authorization;

namespace GEOEmergency.API.Controllers
{
    [ApiController]
    [Route("api/hospital")]
    [Authorize(Roles = "Hospital")]
    public class HospitalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHospitalAssignmentService _hospitalAssignmentService;

        public HospitalController(ApplicationDbContext context, IHospitalAssignmentService hospitalAssignmentService)
        {
            _context = context;
            _hospitalAssignmentService = hospitalAssignmentService;
        }

        // GET: /api/hospital/emergencies
        [HttpGet("emergencies")]
        [AllowAnonymous] // Temporary for testing
        public async Task<IActionResult> GetAssignedEmergencies()
        {
            // Get emergencies that target HOSPITAL or BOTH (same as police logic)
            var emergencies = await _context.Emergencies
                .Where(e => e.Status != "Resolved" && 
                           (e.TargetDepartment == TargetDepartment.HOSPITAL || 
                            e.TargetDepartment == TargetDepartment.BOTH))
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return Ok(emergencies);
        }

        // GET: /api/hospital/emergency/{id}
        [HttpGet("emergency/{id}")]
        [AllowAnonymous] // Temporary for testing
        public async Task<IActionResult> GetEmergencyById(int id)
        {
            try
            {
                // Simple query without complex includes
                var emergency = await _context.Emergencies
                    .Include(e => e.EmergencyMedias)
                    .FirstOrDefaultAsync(e => e.EmergencyId == id);
                    
                if (emergency == null)
                    return NotFound(new { message = "Emergency not found" });

                // Get user separately
                var user = await _context.Users.FindAsync(emergency.UserId);

                // Get assigned hospital separately
                object assignedHospital = null;
                if (emergency.AssignedHospitalId.HasValue)
                {
                    var hospital = await _context.Hospitals.FindAsync(emergency.AssignedHospitalId.Value);
                    if (hospital != null)
                    {
                        var hospitalBeds = await _context.HospitalBeds
                            .FirstOrDefaultAsync(hb => hb.HospitalId == hospital.HospitalId);
                        
                        assignedHospital = new
                        {
                            hospitalId = hospital.HospitalId,
                            name = hospital.Name,
                            latitude = hospital.Latitude,
                            longitude = hospital.Longitude,
                            address = hospital.Address,
                            phoneNumber = hospital.PhoneNumber,
                            hospitalBeds = hospitalBeds != null ? new
                            {
                                totalBeds = hospitalBeds.TotalBeds,
                                availableBeds = hospitalBeds.AvailableBeds
                            } : null
                        };
                    }
                }

                var response = new
                {
                    emergencyId = emergency.EmergencyId,
                    description = emergency.Description,
                    emergencyType = emergency.EmergencyType,
                    status = emergency.Status,
                    targetDepartment = emergency.TargetDepartment,
                    latitude = emergency.Latitude,
                    longitude = emergency.Longitude,
                    address = emergency.Address,
                    createdAt = emergency.CreatedAt,
                    assignedHospitalId = emergency.AssignedHospitalId,
                    user = user != null ? new
                    {
                        userId = user.UserId,
                        fullName = user.FullName,
                        email = user.Email,
                        phoneNumber = user.PhoneNumber
                    } : null,
                    assignedHospital,
                    emergencyMedias = emergency.EmergencyMedias.Select(em => new
                    {
                        mediaId = em.MediaId,
                        mediaType = em.MediaType,
                        mediaData = Convert.ToBase64String(em.MediaData)
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // POST: /api/hospital/emergencies/{id}/reject
        [HttpPost("emergencies/{id}/reject")]
        public async Task<IActionResult> RejectEmergency(int id, [FromBody] RejectEmergencyDTO dto)
        {
            var emergency = await _context.Emergencies
                .FirstOrDefaultAsync(e => e.EmergencyId == id && e.AssignedHospitalId.HasValue);

            if (emergency == null)
            {
                return NotFound(new { message = "Emergency not found or not assigned to any hospital" });
            }

            // Redirect to next available hospital
            var redirectResult = await _hospitalAssignmentService.RedirectToNextAvailableHospitalAsync(id);

            return Ok(new
            {
                message = "Emergency rejected and redirected",
                redirectResult
            });
        }

        // PUT: /api/hospital/emergency/status/{id}
        [HttpPut("emergency/status/{id}")]
        public async Task<IActionResult> UpdateEmergencyStatus(int id, [FromBody] string status)
        {
            // Allowed status values for hospital
            var allowedStatuses = new[] { "Accepted", "OnTheWay", "Resolved" };

            if (!allowedStatuses.Contains(status))
            {
                return BadRequest(new
                {
                    message = "Invalid status. Allowed values: Accepted, OnTheWay, Resolved"
                });
            }

            var emergency = await _context.Emergencies
                .FirstOrDefaultAsync(e => e.EmergencyId == id);

            if (emergency == null)
            {
                return NotFound(new { message = "Emergency not found" });
            }

            emergency.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Emergency status updated successfully",
                emergencyId = emergency.EmergencyId,
                status = emergency.Status
            });
        }

        // GET: /api/hospital/test-distance?lat={lat}&lng={lng}
        [HttpGet("test-distance")]
        [AllowAnonymous]
        public async Task<IActionResult> TestDistanceCalculation(double lat, double lng)
        {
            try
            {
                var hospitals = await _hospitalAssignmentService.GetNearestHospitalsAsync(lat, lng);
                return Ok(new
                {
                    origin = new { latitude = lat, longitude = lng },
                    hospitalDistances = hospitals.OrderBy(h => h.DistanceInKm).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: /api/hospital/debug-emergency/{id}
        [HttpGet("debug-emergency/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DebugEmergency(int id)
        {
            var emergency = await _context.Emergencies.FindAsync(id);
            if (emergency == null)
                return NotFound();

            var hospital = emergency.AssignedHospitalId.HasValue 
                ? await _context.Hospitals.Include(h => h.HospitalBeds).FirstOrDefaultAsync(h => h.HospitalId == emergency.AssignedHospitalId.Value)
                : null;

            return Ok(new
            {
                emergencyId = emergency.EmergencyId,
                status = emergency.Status,
                assignedHospitalId = emergency.AssignedHospitalId,
                hospitalExists = hospital != null,
                hospitalName = hospital?.Name,
                hospitalBeds = hospital?.HospitalBeds?.AvailableBeds
            });
        }
    }
}