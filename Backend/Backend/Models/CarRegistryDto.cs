namespace Backend.Models
{
    public class CarRegistryDto
    {
        public int Id { get; set; }
        public int Course { get; set; }
        public int EngineOil { get; set; }
        public int TransmissionOil { get; set; }
        public DateTime Tech { get; set; }
        public DateTime Insurance { get; set; }
    }
}
