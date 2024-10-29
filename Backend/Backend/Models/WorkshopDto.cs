using Backend.Entities;
using Backend.Models;
namespace Backend.Models
{
    public class WorkshopDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Image { get; set; }
        public string Voivodeship { get; set; }
        public List<TagsDto> Tags { get; set; }
        public float Rate { get; set; }
        public int RatesCount { get; set; }
    }
}
