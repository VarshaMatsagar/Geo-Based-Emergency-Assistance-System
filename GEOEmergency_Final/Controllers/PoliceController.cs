using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GEOEmergency.Data;
using GEOEmergency.API.Models;
using GeoEmergencyResponse.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace GEOEmergency.API.Controllers
{
    [ApiController]
    [Route("api/police")]
    [Authorize(Roles = "Police")]
    public class PoliceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PoliceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /api/police/emergency/all
        [HttpGet("emergency/all")]
        public async Task<IActionResult> GetAllActiveEmergencies()
        {
            var emergencies = await _context.Emergencies
                .Where(e => e.Status != "Resolved" && 
                           (e.TargetDepartment == TargetDepartment.POLICE || 
                            e.TargetDepartment == TargetDepartment.BOTH))
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return Ok(emergencies);
        }

        // GET: /api/police/emergency/{id}
        [HttpGet("emergency/{id}")]
        public async Task<IActionResult> GetEmergencyById(int id)
        {
            var emergency = await _context.Emergencies
                .Include(e => e.User)
                .Include(e => e.AssignedHospital)
                .Include(e => e.EmergencyMedias)
                .FirstOrDefaultAsync(e => e.EmergencyId == id);

            if (emergency == null)
                return NotFound(new { message = "Emergency not found" });

            // Convert binary data to base64 for JSON serialization
            var response = new
            {
                emergencyId = emergency.EmergencyId,
                userId = emergency.UserId,
                emergencyType = emergency.EmergencyType,
                description = emergency.Description,
                status = emergency.Status,
                targetDepartment = emergency.TargetDepartment,
                latitude = emergency.Latitude,
                longitude = emergency.Longitude,
                address = emergency.Address,
                assignedHospitalId = emergency.AssignedHospitalId,
                createdAt = emergency.CreatedAt,
                user = emergency.User,
                assignedHospital = emergency.AssignedHospital,
                emergencyMedias = emergency.EmergencyMedias.Select(em => new
                {
                    mediaId = em.MediaId,
                    mediaType = em.MediaType,
                    mediaData = Convert.ToBase64String(em.MediaData)
                }).ToList()
            };

            return Ok(response);
        }

        // PUT: /api/emergency/status/{id}
        [HttpPut("emergency/status/{id}")]
        public async Task<IActionResult> UpdateEmergencyStatus(int id, [FromBody] string status)
        {
            // Allowed status values
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

    }
}
