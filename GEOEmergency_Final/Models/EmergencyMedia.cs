using GEOEmergency.API.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GeoEmergencyResponse.API.Models
{
    public class EmergencyMedia
    {
        [Key]
        public int MediaId { get; set; }

        [ForeignKey("Emergency")]
        public int EmergencyId { get; set; }

        [Required]
        public string MediaType { get; set; }
        // Image

        [Required]
        public byte[] MediaData { get; set; }
        // Actual image stored as binary

        public Emergency Emergency { get; set; }
    }
}
