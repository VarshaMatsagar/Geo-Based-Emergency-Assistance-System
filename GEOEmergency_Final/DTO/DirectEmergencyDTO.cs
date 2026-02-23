using GEOEmergency.API.Models;

namespace GEOEmergency.DTOs
{
    public class DirectEmergencyDTO
    {
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Address { get; set; }
    }
}