using Backend.Entities;
namespace Backend.Models
{
    public class AddEventDto
    {
        public string Name{ get; set; }
        public string Date{ get; set; }
        public string City{ get; set; }
        public string Address{ get; set; }
        public IFormFile PhotoURL{ get; set; }
        public string Voivodeship{ get; set; }
        public string EventTags{ get; set; }
        public string Desc{ get; set; }
    }
}
