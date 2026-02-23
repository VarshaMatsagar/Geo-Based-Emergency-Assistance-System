namespace GEOEmergency.DTOs
{
    public class EmergencyResponseDTO
    {
        public int EmergencyId { get; set; }
        public string EmergencyType { get; set; }
        public string Description { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // User/Citizen details
        public int UserId { get; set; }
        public string UserFullName { get; set; }
        public string UserPhoneNumber { get; set; }
        public string UserEmail { get; set; }
    }
}