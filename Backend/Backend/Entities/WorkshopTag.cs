namespace Backend.Entities
{
    public class WorkshopTag
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<Workshop> Workshops { get; set; } = new List<Workshop>();
    }
}
