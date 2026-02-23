using System.ComponentModel.DataAnnotations;

namespace GeoEmergencyResponse.API.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        public string RoleName { get; set; }
        // Citizen, Police, Hospital, Admin
    }
}
