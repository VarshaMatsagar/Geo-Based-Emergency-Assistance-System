using System.ComponentModel.DataAnnotations;

namespace GeoEmergencyResponse.API.Models
{
    public class OtpVerification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Otp { get; set; }

        [Required]
        public DateTime ExpirationTime { get; set; }

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}