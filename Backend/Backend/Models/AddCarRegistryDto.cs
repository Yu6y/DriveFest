namespace Backend.Models
{
    public class AddCarRegistryDto
    {
        public string Course { get; set; }
        public string? Insurance { get; set; }
        public string? Tech { get; set; }
        public string EngineOil { get; set; }
        public string TransmissionOil { get; set; }
        public string Brakes { get; set; }
    }
}
