using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace GEOEmergency.Services
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string email, string otp);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmailAsync(string email, string otp)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("GEO Emergency System", _configuration["Email:From"]));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Email Verification - OTP";

                message.Body = new TextPart("html")
                {
                    Text = $@"
                        <h2>Email Verification</h2>
                        <p>Your OTP for email verification is: <strong>{otp}</strong></p>
                        <p>This OTP will expire in 5 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>"
                };

                using var client = new SmtpClient();
                await client.ConnectAsync(_configuration["Email:Host"], int.Parse(_configuration["Email:Port"]), SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_configuration["Email:Username"], _configuration["Email:Password"]);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                throw new Exception($"Email sending failed: {ex.Message}", ex);
            }
        }
    }
}