namespace GEOEmergency.DTOs
{
    public class HospitalDistanceDTO
    {
        public int HospitalId { get; set; }
        public string HospitalName { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double DistanceInKm { get; set; }
        public string? Duration { get; set; }
        public int AvailableBeds { get; set; }
    }

    public class EmergencyAssignmentResponseDTO
    {
        public int EmergencyId { get; set; }
        public int? AssignedHospitalId { get; set; }
        public string? AssignedHospitalName { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }

    public class RejectEmergencyDTO
    {
        public string Reason { get; set; } = "No available beds";
    }
}