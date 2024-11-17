using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string HashPassword { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string UserPic { get; set; }
        public bool IsAdmin { get; set; }

        public virtual List<Comment> Comments { get; set; }
        public virtual List<WorkshopComment> WorkshopComments {  get; set; }
        public virtual List<Event> LikedEvents { get; set; }
        public virtual List<WorkshopRating> WorkshopRatings { get; set; }

        public virtual List<CarExpense> CarExpenses { get; set; }
        public virtual List<CarRegistry> CarRegistries { get; set; }
        public virtual List<UserCar> UserCars { get; set; }

    }
}
