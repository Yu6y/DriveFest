namespace Backend.Models
{
    public class EditWorkshopFormDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Voivodeship { get; set; }
        public string Tags { get; set; }
        public IFormFile? PhotoURL { get; set; } = null;
        public string Address { get; set; }
        public string Description { get; set; }
    }
}
