using GEOEmergency.API.Models;
using GEOEmergency.Data;
using GEOEmergency.DTOs;
using GEOEmergency.Services;
using GeoEmergencyResponse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GEOEmergency.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmergencyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHospitalAssignmentService _hospitalAssignmentService;

        public EmergencyController(ApplicationDbContext context, IHospitalAssignmentService hospitalAssignmentService)
        {
            _context = context;
            _hospitalAssignmentService = hospitalAssignmentService;
        }

        private int GetLoggedInUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        }

        // POST: /api/emergencies
        [HttpPost]
        [Authorize(Roles = "Citizen")]
        public async Task<ActionResult<EmergencyAssignmentResponseDTO>> CreateEmergency(EmergencyMessageDTO dto)
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

        // GET: /api/emergencies/nearest-hospitals
        [HttpGet("nearest-hospitals")]
        [Authorize(Roles = "Citizen")]
        public async Task<ActionResult<List<HospitalDistanceDTO>>> GetNearestHospitals(double latitude, double longitude)
        {
            var hospitals = await _hospitalAssignmentService.GetNearestHospitalsAsync(latitude, longitude);
            return Ok(hospitals);
        }
    }
}