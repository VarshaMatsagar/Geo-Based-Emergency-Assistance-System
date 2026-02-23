using GEOEmergency.API.Models;
using GEOEmergency.Data;
using GEOEmergency.DTOs;
using GEOEmergency.Services;
using GeoEmergencyResponse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GEOEmergency.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Citizen")]
    public class CitizenController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHospitalAssignmentService _hospitalAssignmentService;

        public CitizenController(ApplicationDbContext context, IHospitalAssignmentService hospitalAssignmentService)
        {
            _context = context;
            _hospitalAssignmentService = hospitalAssignmentService;
        }

        private int GetLoggedInUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        }
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllCitizens()
        {
            var citizens = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName == "Citizen")
                .ToListAsync();

            return citizens;
        }

        // GET: api/Citizen/profile
        [HttpGet("profile/{citizenId}")]
        public async Task<ActionResult<User>> GetProfile(int citizenId)
        {
            int userId = GetLoggedInUserId();

            var citizen = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (citizen == null)
                return NotFound();

            return citizen;
        }

        // PUT: api/Citizen/profile
        [HttpPut("profile/{citizenId}")]
        public async Task<IActionResult> UpdateCitizenProfile(UpdateCitizenProfileDTO dto)
        {
            int userId = GetLoggedInUserId();

            // Ensure citizen updates only his own profile
            if (userId != dto.UserId)
                return BadRequest("Unauthorized profile update");

            var citizen = await _context.Users.FindAsync(userId);

            if (citizen == null)
                return NotFound();

            // Update profile fields
            citizen.FullName = dto.FullName;
            citizen.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                var hasher = new PasswordHasher<User>();
                citizen.PasswordHash = hasher.HashPassword(citizen, dto.NewPassword);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Citizen/emergency/message
        [HttpPost("emergency/message")]
        public async Task<ActionResult<EmergencyAssignmentResponseDTO>> CreateEmergencyWithMessage(EmergencyMessageDTO dto)
        {
            var emergency = new Emergency
            {
                UserId = GetLoggedInUserId(),
                Description = dto.Description,
                EmergencyType = "Message",
                Status = "Pending",
                TargetDepartment = dto.TargetDepartment,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Address = dto.Address,
                CreatedAt = DateTime.Now
            };

            _context.Emergencies.Add(emergency);
            await _context.SaveChangesAsync();

            // Auto-assign hospital if target includes HOSPITAL
            EmergencyAssignmentResponseDTO assignmentResult = null;
            if (dto.TargetDepartment == TargetDepartment.HOSPITAL || dto.TargetDepartment == TargetDepartment.BOTH)
            {
                assignmentResult = await _hospitalAssignmentService.AssignNearestAvailableHospitalAsync(emergency);
            }

            return Ok(assignmentResult ?? new EmergencyAssignmentResponseDTO
            {
                EmergencyId = emergency.EmergencyId,
                Status = "Created",
                Message = "Emergency created successfully (Police only)"
            });
        }

        // POST: api/Citizen/emergency/image

        [HttpPost("emergency/image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateEmergencyWithImage([FromForm] EmergencyImageDTO dto)
        {
            int userId = GetLoggedInUserId();

            if (dto.Image == null || dto.Image.Length == 0)
                return BadRequest("Image is required");

            // Convert image to BLOB
            byte[] imageBytes;
            using (var ms = new MemoryStream())
            {
                await dto.Image.CopyToAsync(ms);
                imageBytes = ms.ToArray();
            }

            var emergency = new Emergency
            {
                UserId = userId,
                EmergencyType = "Image",
                Description = dto.Description,
                Status = "Pending",
                TargetDepartment = dto.TargetDepartment,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Address = dto.Address,
                CreatedAt = DateTime.Now
            };

            _context.Emergencies.Add(emergency);
            await _context.SaveChangesAsync();

            var media = new EmergencyMedia
            {
                EmergencyId = emergency.EmergencyId,
                MediaType = dto.Image.ContentType,
                MediaData = imageBytes
            };

            _context.EmergencyMedias.Add(media);
            await _context.SaveChangesAsync();

            return Ok("Image emergency stored successfully as BLOB");
        }



        // POST: api/Citizen/emergency/alert
        [HttpPost("emergency/alert")]
        public async Task<ActionResult<EmergencyAssignmentResponseDTO>> PanicEmergencyAlert(DirectEmergencyDTO dto)
        {
            int userId = GetLoggedInUserId();

            Emergency emergency = new Emergency
            {
                UserId = userId,
                Description = "Emergency alert triggered by citizen",
                EmergencyType = "EmergencyButton",
                Status = "Pending",
                TargetDepartment = TargetDepartment.BOTH,
                Latitude = dto?.Latitude,
                Longitude = dto?.Longitude,
                Address = dto?.Address,
                CreatedAt = DateTime.Now
            };

            _context.Emergencies.Add(emergency);
            await _context.SaveChangesAsync();

            // Auto-assign hospital for panic alerts (same logic as message emergencies)
            EmergencyAssignmentResponseDTO assignmentResult = await _hospitalAssignmentService.AssignNearestAvailableHospitalAsync(emergency);

            return Ok(assignmentResult);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public ActionResult TestConnection()
        {
            return Ok(new { message = "Connection successful", timestamp = DateTime.Now });
        }

        [HttpGet("emergency/{id}")]
        public async Task<ActionResult<Emergency>> GetEmergencyById(int id)
        {
            var emergency = await _context.Emergencies.FindAsync(id);

            if (emergency == null)
                return NotFound();

            return emergency;
        }
        private bool CitizenExists(int citizenId)
        {
            return _context.Users.Any(e => e.UserId == citizenId);
        }
    }
}
