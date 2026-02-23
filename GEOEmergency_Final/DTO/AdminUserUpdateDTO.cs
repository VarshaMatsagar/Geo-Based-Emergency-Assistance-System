namespace GEOEmergency.DTO
{
    public class AdminUserUpdateDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int RoleId { get; set; }

        // Optional password update
        public string? NewPassword { get; set; }
    }
}
