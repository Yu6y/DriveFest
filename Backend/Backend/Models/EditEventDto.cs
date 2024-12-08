namespace Backend.Models
{
    public class EditEventDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public string Voivodeship { get; set; }
        public string Image { get; set; }
        public string PhotoURL { get; set; } = null;
        public List<TagsDto> Tags { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
    }   
}
