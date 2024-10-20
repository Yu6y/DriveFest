namespace Backend.Entities
{
    public class WorkshopDescription
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public int WorkshopId { get; set; }

        public virtual Workshop Workshop { get; set; }
        public List<WorkshopComment> WorkshopsComments { get; set; } = new List<WorkshopComment>();
    }
}
