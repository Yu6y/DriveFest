namespace Backend.Models
{
    public class WorkshopDescDto : WorkshopDto
    {
        public int WorkshopDescId { get; set; }
        public string Address {  get; set; }
        public string Description { get; set; }
    }
}
