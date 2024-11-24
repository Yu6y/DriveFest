using System.ComponentModel;

namespace Backend.Entities
{
    public class Event
    {
        public int Id { get; set; }          
        public string Name { get; set; }          
        public DateTime Date { get; set; }        
        public string Location { get; set; }      
        public string Voivodeship { get; set; }   
        public int FollowersCount { get; set; }   
        public string Image { get; set; }         
        public List<Tag> Tags { get; set; }
        public bool IsVerified { get; set; }

        public virtual EventDescription EventDescription { get; set; }
        public virtual List<User> LikedByUsers { get; set; }
    }
}
