namespace Backend.Entities
{
    public class CarExpense
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }

        public virtual User User { get; set; }
    }
}
