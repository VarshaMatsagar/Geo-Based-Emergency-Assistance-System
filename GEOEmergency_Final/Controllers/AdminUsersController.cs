using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GEOEmergency.Data;
using GeoEmergencyResponse.API.Models;
using GEOEmergency.DTO;
using GEOEmergency.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace GEOEmergency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminUsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AdminUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName != "Admin")
                .ToListAsync();
        }

        // GET: api/AdminUsers/roles
        [HttpGet("roles")]
        [AllowAnonymous] // Temporary for debugging
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            try
            {
                var roles = await _context.Roles.ToListAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/AdminUsers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName != "Admin")
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return NotFound();

            return user;
        }

        // POST: api/AdminUsers
        [HttpPost]
        public async Task<IActionResult> CreateUser(AdminUserCreateDTO dto)
        {
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                RoleId = dto.RoleId,
                PasswordHash = PasswordHelper.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User created successfully");
        }

        // PUT: api/AdminUsers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, AdminUserUpdateDTO dto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName != "Admin")
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return NotFound();

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;
            user.RoleId = dto.RoleId;

            // Update password only if provided
            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                user.PasswordHash = PasswordHelper.HashPassword(dto.NewPassword);
            }

            await _context.SaveChangesAsync();

            return Ok("User updated successfully");
        }

        // DELETE: api/AdminUsers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName != "Admin")
                .FirstOrDefaultAsync(u => u.UserId == id);
                
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
