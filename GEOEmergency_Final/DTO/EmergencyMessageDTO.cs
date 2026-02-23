using System.ComponentModel.DataAnnotations;
using GEOEmergency.API.Models;

namespace GEOEmergency.DTOs
{
    public class EmergencyMessageDTO
    {
        [Required]
        public string Description { get; set; }
        
        [Required]
        public TargetDepartment TargetDepartment { get; set; }
        
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Address { get; set; }
    }
}