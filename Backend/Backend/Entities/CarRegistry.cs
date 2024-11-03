namespace Backend.Entities
{
    public class CarRegistry
    {
        public int Id { get; set; }
        public string Course { get; set; }
        public DateTime? Insurance { get; set; }
        public DateTime? Tech { get; set; }
        public string EngineOil { get; set; }
        public string TransmissionOil { get; set; }
        public string Brakes { get; set; }

        public int UserId { get; set; }

        public virtual User User { get; set; }
    }
}
