using Backend.Entities;
namespace Backend.Models
{
    public class AddEventDto
    {
        public string Name{ get; set; }
        public string Date{ get; set; }
        public string City{ get; set; }
        public string Address{ get; set; }
        public string PhotoURL{ get; set; }
        public string Voivodeship{ get; set; }
        public List<Tag> Tags{ get; set; }
        public string Desc{ get; set; }
    }
}
