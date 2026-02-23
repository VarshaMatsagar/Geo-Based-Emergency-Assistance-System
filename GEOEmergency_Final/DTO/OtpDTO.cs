using System.ComponentModel.DataAnnotations;

namespace GEOEmergency.DTO
{
    public class SendOtpDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class VerifyOtpDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string Otp { get; set; }
    }
}