using GEOEmergency.Data;
using GeoEmergencyResponse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GEOEmergency.Services
{
    public interface IOtpService
    {
        Task<string> GenerateAndSendOtpAsync(string email);
        Task<bool> VerifyOtpAsync(string email, string otp);
        Task InvalidateOtpAsync(string email);
    }

    public class OtpService : IOtpService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly Dictionary<string, DateTime> _lastOtpSent = new();

        public OtpService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<string> GenerateAndSendOtpAsync(string email)
        {
            // Rate limiting: 1 OTP per minute
            if (_lastOtpSent.ContainsKey(email) && 
                DateTime.UtcNow - _lastOtpSent[email] < TimeSpan.FromMinutes(1))
            {
                throw new InvalidOperationException("Please wait 1 minute before requesting another OTP");
            }

            // Invalidate existing OTPs
            await InvalidateOtpAsync(email);

            // Generate 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Store in database
            var otpVerification = new OtpVerification
            {
                Email = email,
                Otp = otp,
                ExpirationTime = DateTime.UtcNow.AddMinutes(5),
                IsVerified = false
            };

            _context.OtpVerifications.Add(otpVerification);
            await _context.SaveChangesAsync();

            // Send email
            await _emailService.SendOtpEmailAsync(email, otp);

            // Update rate limiting
            _lastOtpSent[email] = DateTime.UtcNow;

            return otp;
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            var otpRecord = await _context.OtpVerifications
                .Where(o => o.Email == email && o.Otp == otp && !o.IsVerified)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otpRecord == null || otpRecord.ExpirationTime < DateTime.UtcNow)
                return false;

            otpRecord.IsVerified = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task InvalidateOtpAsync(string email)
        {
            var existingOtps = await _context.OtpVerifications
                .Where(o => o.Email == email && !o.IsVerified)
                .ToListAsync();

            foreach (var otp in existingOtps)
            {
                otp.IsVerified = true;
            }

            await _context.SaveChangesAsync();
        }
    }
}