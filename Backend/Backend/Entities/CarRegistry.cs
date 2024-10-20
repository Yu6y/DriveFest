namespace Backend.Entities
{
    public class CarRegistry
    {
        public int Id { get; set; }
        public int Course { get; set; }
        public int EngineOil { get; set; }
        public int TransmissionOil { get; set; }
        public DateTime Tech {  get; set; }
        public DateTime Insurance {  get; set; }
        public int UserId { get; set; }

        public virtual User User { get; set; }
    }
}
