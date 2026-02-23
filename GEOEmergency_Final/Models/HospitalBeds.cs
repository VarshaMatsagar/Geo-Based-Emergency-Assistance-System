using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GEOEmergency.API.Models
{
    public class HospitalBeds
    {
        [Key]
        public int HospitalBedsId { get; set; }

        [ForeignKey("Hospital")]
        public int HospitalId { get; set; }

        [Required]
        public int TotalBeds { get; set; }

        [Required]
        public int AvailableBeds { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.Now;

        // Navigation property
        public Hospital Hospital { get; set; }
    }
}