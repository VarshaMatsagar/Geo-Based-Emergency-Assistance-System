using GEOEmergency.Data;
using GEOEmergency.DTO;
using GEOEmergency.Helpers;
using GEOEmergency.Services;
using GeoEmergencyResponse.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace GEOEmergency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IOtpService _otpService;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, IOtpService otpService)
        {
            _context = context;
            _configuration = configuration;
            _otpService = otpService;
        }

        // ============================
        // TEST EMAIL API (Remove after testing)
        // POST: api/auth/test-email
        // ============================
        [HttpPost("test-email")]
        public async Task<IActionResult> TestEmail()
        {
            try
            {
                await _otpService.GenerateAndSendOtpAsync("malivedant1@gmail.com");
                return Ok(new { message = "Test email sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = ex.Message,
                    innerError = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // ============================
        // SEND OTP API
        // POST: api/auth/send-otp
        // ============================
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp(SendOtpDTO sendOtpDto)
        {
            // Validate email format
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            if (!emailRegex.IsMatch(sendOtpDto.Email))
                return BadRequest("Invalid email format");

            try
            {
                await _otpService.GenerateAndSendOtpAsync(sendOtpDto.Email);
                return Ok(new { message = "OTP sent successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to send OTP: {ex.Message}");
            }
        }

        // ============================
        // VERIFY OTP API
        // POST: api/auth/verify-otp
        // ============================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDTO verifyOtpDto)
        {
            var isValid = await _otpService.VerifyOtpAsync(verifyOtpDto.Email, verifyOtpDto.Otp);
            
            if (!isValid)
                return BadRequest("Invalid or expired OTP");

            return Ok(new { message = "OTP verified successfully" });
        }

        // ============================
        // REGISTER API
        // POST: api/auth/register
        // ============================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDto)
        {
            // Validate email format
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            if (!emailRegex.IsMatch(registerDto.Email))
                return BadRequest("Invalid email format");

            // Check if email is verified
            var isEmailVerified = await _context.OtpVerifications
                .AnyAsync(o => o.Email == registerDto.Email && o.IsVerified);
            
            if (!isEmailVerified)
                return BadRequest("Email not verified. Please verify your email first.");

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            if (existingUser != null)
                return BadRequest("Email already registered");

            // Default role = Citizen
            var citizenRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == "Citizen");

            if (citizenRole == null)
                return BadRequest("Citizen role not found");

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                PasswordHash = PasswordHelper.HashPassword(registerDto.Password),
                RoleId = citizenRole.RoleId,
                IsEmailVerified = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }


        // =================================
        // LOGIN API
        // POST: api/auth/login
        // ============================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            // 1. Find user by email
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            // 2. Verify password
            var hashedPassword = PasswordHelper.HashPassword(loginDto.Password);

            if (user.PasswordHash != hashedPassword)
            {
                return Unauthorized("Invalid email or password");
            }

            // 3. Generate JWT token
            var token = JwtTokenHelper.GenerateToken(
                user.UserId,
                user.Role.RoleName,
                _configuration
            );

            // 4. Return response
            var redirectTo = user.Role.RoleName switch
            {
                "Citizen" => "/citizen",
                "Police" => "/police",
                "Hospital" => "/hospital",
                "Admin" => "/admin",
                _ => "/"
            };

            return Ok(new
            {
                Token = token,
                user.UserId,
                user.FullName,
                user.Email,
                Role = user.Role.RoleName,
                RoleId = user.RoleId,
                RedirectTo = redirectTo
            });
        }
    }
}
