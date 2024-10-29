using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities
{
    public class WorkshopRating
    {
        public int UserId { get; set; }
        public int WorkshopId { get; set; }
        public int Rating { get; set; } // Ocena w skali od 1 do 5

        public virtual User User { get; set; }
        public virtual Workshop Workshop { get; set; }
    }
}