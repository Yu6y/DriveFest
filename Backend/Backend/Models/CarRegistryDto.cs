namespace Backend.Models
{
    public class CarRegistryDto
    {
        public string Course { get; set; }
        public DateTime? Insurance { get; set; }
        public DateTime? Tech { get; set; }
        public string EngineOil { get; set; }
        public string TransmissionOil { get; set; }
        public string Brakes { get; set; }
    }
}
