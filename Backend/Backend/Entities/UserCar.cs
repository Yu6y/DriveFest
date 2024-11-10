namespace Backend.Entities
{
    public class UserCar
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhotoUrl { get; set; }

        public int UserId { get; set; }

        public virtual User User { get; set; }
        public virtual List<CarExpense> CarExpenses { get; set; }
        public virtual List<CarRegistry> CarRegistries { get; set; }
    }
}
