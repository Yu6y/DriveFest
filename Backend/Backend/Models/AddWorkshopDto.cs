using Backend.Entities;

namespace Backend.Models
{
    public class AddWorkshopDto
    {
        public string Name { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public IFormFile PhotoURL { get; set; }
        public string Voivodeship { get; set; }
        public List<WorkshopTag> Tags { get; set; }
        public string Desc { get; set; }
    }
}
