namespace Backend.Entities
{
    public class Workshop
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Image { get; set; }
        public string Voivodeship { get; set; }
        public List<WorkshopTag> Tags { get; set; }
        public float Rate { get; set; }

        public virtual WorkshopDescription WorkshopDescription { get; set; }
    }
}
