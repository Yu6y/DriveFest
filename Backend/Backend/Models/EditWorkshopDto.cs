namespace Backend.Models
{
    public class EditWorkshopDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Voivodeship { get; set; }
        public List<TagsDto> Tags { get; set; }
        public string Image { get; set; }
        public IFormFile? PhotoURL { get; set; } = null;
        public string Address { get; set; }
        public string Description { get; set; }
    }
}
