namespace Backend.Models
{
    public class EditEventFormDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Date { get; set; }
        public string Location { get; set; }
        public string Voivodeship { get; set; }
        public IFormFile? PhotoURL { get; set; } = null;
        public string Tags { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
    }
}
