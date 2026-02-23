using GEOEmergency.API.Models;
using GEOEmergency.DTOs;
using Newtonsoft.Json;

namespace GEOEmergency.Services
{
    public interface IDistanceCalculationService
    {
        Task<List<HospitalDistanceDTO>> CalculateDistancesToHospitalsAsync(double originLat, double originLng, List<Hospital> hospitals);
        double CalculateHaversineDistance(double lat1, double lng1, double lat2, double lng2);
    }

    public class DistanceCalculationService : IDistanceCalculationService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<DistanceCalculationService> _logger;

        public DistanceCalculationService(HttpClient httpClient, IConfiguration configuration, ILogger<DistanceCalculationService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<List<HospitalDistanceDTO>> CalculateDistancesToHospitalsAsync(double originLat, double originLng, List<Hospital> hospitals)
        {
            var results = new List<HospitalDistanceDTO>();

            try
            {
                // Try Google Distance Matrix API first
                results = await CalculateWithGoogleMapsAsync(originLat, originLng, hospitals);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Google Maps API failed, falling back to Haversine calculation");
                // Fallback to Haversine calculation
                results = CalculateWithHaversine(originLat, originLng, hospitals);
            }

            return results.OrderBy(r => r.DistanceInKm).ToList();
        }

        private async Task<List<HospitalDistanceDTO>> CalculateWithGoogleMapsAsync(double originLat, double originLng, List<Hospital> hospitals)
        {
            var apiKey = _configuration["GoogleMaps:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogWarning("Google Maps API key not configured, falling back to Haversine");
                throw new InvalidOperationException("Google Maps API key not configured");
            }

            var origin = $"{originLat},{originLng}";
            var destinations = string.Join("|", hospitals.Select(h => $"{h.Latitude},{h.Longitude}"));

            var url = $"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destinations}&mode=driving&units=metric&key={apiKey}";
            
            _logger.LogInformation($"Calling Google Distance Matrix API for {hospitals.Count} hospitals from origin ({originLat}, {originLng})");

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonContent = await response.Content.ReadAsStringAsync();
            var distanceMatrix = JsonConvert.DeserializeObject<GoogleDistanceMatrixResponse>(jsonContent);

            if (distanceMatrix?.Status != "OK")
            {
                _logger.LogError($"Google Maps API returned status: {distanceMatrix?.Status}");
                throw new Exception($"Google Maps API error: {distanceMatrix?.Status}");
            }

            _logger.LogInformation($"Google Maps API call successful, processing {distanceMatrix.Rows[0].Elements.Length} results");

            var results = new List<HospitalDistanceDTO>();
            var elements = distanceMatrix.Rows[0].Elements;

            for (int i = 0; i < hospitals.Count && i < elements.Length; i++)
            {
                var element = elements[i];
                var hospital = hospitals[i];

                if (element.Status == "OK")
                {
                    var distanceKm = element.Distance.Value / 1000.0;
                    _logger.LogInformation($"Google Maps: {hospital.Name} - {distanceKm:F2} km, {element.Duration.Text}");
                    
                    results.Add(new HospitalDistanceDTO
                    {
                        HospitalId = hospital.HospitalId,
                        HospitalName = hospital.Name,
                        Latitude = hospital.Latitude,
                        Longitude = hospital.Longitude,
                        DistanceInKm = distanceKm,
                        Duration = element.Duration.Text,
                        AvailableBeds = hospital.HospitalBeds?.AvailableBeds ?? 0
                    });
                }
                else
                {
                    // Fallback to Haversine for this hospital
                    var distance = CalculateHaversineDistance(originLat, originLng, hospital.Latitude, hospital.Longitude);
                    _logger.LogWarning($"Google Maps failed for {hospital.Name}, using Haversine: {distance:F2} km");
                    
                    results.Add(new HospitalDistanceDTO
                    {
                        HospitalId = hospital.HospitalId,
                        HospitalName = hospital.Name,
                        Latitude = hospital.Latitude,
                        Longitude = hospital.Longitude,
                        DistanceInKm = distance,
                        Duration = "Estimated",
                        AvailableBeds = hospital.HospitalBeds?.AvailableBeds ?? 0
                    });
                }
            }

            return results;
        }

        private List<HospitalDistanceDTO> CalculateWithHaversine(double originLat, double originLng, List<Hospital> hospitals)
        {
            return hospitals.Select(hospital => new HospitalDistanceDTO
            {
                HospitalId = hospital.HospitalId,
                HospitalName = hospital.Name,
                Latitude = hospital.Latitude,
                Longitude = hospital.Longitude,
                DistanceInKm = CalculateHaversineDistance(originLat, originLng, hospital.Latitude, hospital.Longitude),
                Duration = "Estimated",
                AvailableBeds = hospital.HospitalBeds?.AvailableBeds ?? 0
            }).ToList();
        }

        public double CalculateHaversineDistance(double lat1, double lng1, double lat2, double lng2)
        {
            const double R = 6371; // Earth's radius in kilometers

            var dLat = ToRadians(lat2 - lat1);
            var dLng = ToRadians(lng2 - lng1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }

        private static double ToRadians(double degrees) => degrees * Math.PI / 180;
    }

    // Google Maps API Response Models
    public class GoogleDistanceMatrixResponse
    {
        public string Status { get; set; }
        public Row[] Rows { get; set; }
    }

    public class Row
    {
        public Element[] Elements { get; set; }
    }

    public class Element
    {
        public string Status { get; set; }
        public Distance Distance { get; set; }
        public Duration Duration { get; set; }
    }

    public class Distance
    {
        public string Text { get; set; }
        public int Value { get; set; }
    }

    public class Duration
    {
        public string Text { get; set; }
        public int Value { get; set; }
    }
}