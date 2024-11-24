namespace Backend.Models
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
        public string Voivodeship { get; set; }
        public int FollowersCount { get; set; }
        public string Image { get; set; }
        public bool IsFavorite { get; set; } = false;
        public List<TagsDto> Tags { get; set; }
        public bool IsVerified { get; set; }
    }
}
