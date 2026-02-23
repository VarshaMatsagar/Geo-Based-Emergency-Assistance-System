using GEOEmergency.API.Models;
using GeoEmergencyResponse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GEOEmergency.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Emergency> Emergencies { get; set; }
        public DbSet<Hospital> Hospitals { get; set; }
        public DbSet<HospitalBeds> HospitalBeds { get; set; }
        public DbSet<EmergencyMedia> EmergencyMedias { get; set; }
        public DbSet<OtpVerification> OtpVerifications { get; set; }
    }
}
