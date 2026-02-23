using GeoEmergencyResponse.API.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GEOEmergency.API.Models
{
    public class Emergency
    {
        [Key]
        public int EmergencyId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public string EmergencyType { get; set; }
        // Message, Image, EmergencyButton

        [Required]
        public string Description { get; set; }

        [Required]
        public string Status { get; set; }
        // Pending, Accepted, OnTheWay, Resolved, REDIRECTED

        [Required]
        public TargetDepartment TargetDepartment { get; set; }
        // POLICE, HOSPITAL, BOTH

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Address { get; set; }

        [ForeignKey("AssignedHospital")]
        public int? AssignedHospitalId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User User { get; set; }
        public Hospital? AssignedHospital { get; set; }
        public ICollection<EmergencyMedia> EmergencyMedias { get; set; } = new List<EmergencyMedia>();
    }
}
