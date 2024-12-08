    using Backend.Entities;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using AutoMapper;
using Backend.Models;
using Backend.Exceptions;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Globalization;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Diagnostics;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq.Expressions;
using Firebase.Storage;
using System.Text.Json;
using Backend.Migrations;

namespace Backend.Services
{
    public interface IEventService
    {
        Task<IEnumerable<EventDto>> GetAllEvents(int userId);
        Task<EventDescDto> GetEventDesc(int eventId, int userId);
        Task<IEnumerable<EventDto>> GetEventsFiltered(string searchTerm, string dateFrom, string dateTo, string sortBy, string tags, string voivodeships, int userId);
        Task<IEnumerable<TagsDto>> GetEventTags();
        Task<IEnumerable<CommentDto>> GetComments(int eventId);
        Task<CommentDto> AddComment(int eventId, string content, int userId, string username, string userPic);
        Task<IEnumerable<EventDto>> GetFavEvents(int userId);
        Task<int> AddFavEvent(int eventId, int userId);
        Task<int> DeleteFavEvent(int eventId, int userId);
        Task<int> AddEvent(AddEventDto addEvent, bool UserAdmin);
    }

    public class EventService : IEventService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;
        private Random random = new Random();

        public EventService(EventsDbContext dbContext, IMapper mapper)
        {
            this._dbContext = dbContext;
            this._mapper = mapper;
        }

        public async Task<IEnumerable<EventDto>> GetAllEvents(int userId)
        {
            var events = _dbContext
                .Events
                .Include(c => c.Tags)
                .ToList();

            var favorites = _dbContext
                .Events
                .Where(l => l.LikedByUsers.Any(p => p.Id == userId))
                .ToList();

            var eventsReturn = _mapper.Map<List<EventDto>>(events);

            eventsReturn.ForEach(e =>
            {
                favorites.ForEach(f =>
                {
                    if (e.Id == f.Id)
                        e.IsFavorite = true;
                });
            });

            return eventsReturn;
        }

        public async Task<IEnumerable<EventDto>> GetEventsFiltered(string searchTerm, string dateFrom, string dateTo, string sortBy, string tags, string voivodeships, int userId)
        {
            DateTime dateFromNew, dateToNew;

            if (!(DateTime.TryParse(dateFrom, out dateFromNew) && DateTime.TryParse(dateTo, out dateToNew)))
                throw new NotFoundException("Given date error");

            List<int> tagsList = null;
            List<string> voivodeshipsList = null;

            if (tags != null)
                tagsList = tags.Split(',').Select(int.Parse).ToList();
            if (voivodeships != null)
                voivodeshipsList = voivodeships.Split(',').ToList();

            var query = _dbContext
                    .Events
                    .Include(e => e.Tags)
                    .Where(r => r.Date.Date >= dateFromNew && r.Date.Date <= dateToNew)
                    .Where(c => EF.Functions.Like(c.Name, $"%{searchTerm}%"));

            if (tagsList != null)
            {
                query = query.Where(e => e.Tags.Any(t => tagsList.Contains(t.Id)));
            }

            if (voivodeshipsList != null)
            {
                query = query.Where(e => voivodeshipsList.Contains(e.Voivodeship));
            }


            List<Event> list;

            if (sortBy == "NONE")
                list = await query.ToListAsync();

            else if (sortBy == "ASC")
                list = await query.OrderBy(c => c.Date).ToListAsync();
            else
                list = await query.OrderByDescending(c => c.Date).ToListAsync();

            var favorites = _dbContext
                .Events
                .Where(l => l.LikedByUsers.Any(p => p.Id == userId))
                .ToList();

            var eventsReturn = _mapper.Map<List<EventDto>>(list);

            eventsReturn.ForEach(e =>
            {
                favorites.ForEach(f =>
                {
                    if (e.Id == f.Id)
                        e.IsFavorite = true;
                });
            });

            return eventsReturn;
        }

        public async Task<EventDescDto> GetEventDesc(int eventId, int userId)
        {
            var eventExist = await _dbContext.EventDescriptions.AnyAsync(e => e.EventId == eventId);
            if (!eventExist)
                throw new Exception("Resource not found");

            var eventDesc = _dbContext
                .Events
                .Include(e => e.EventDescription)
                .Include(e => e.Tags)
                .FirstOrDefault(r => r.Id == eventId);

            var eventLiked = await _dbContext
                 .Events
                 .Where(e => e.Id == eventId)
                 .AnyAsync(e => e.LikedByUsers.Any(u => u.Id == userId));

            var liked = _mapper.Map<EventDescDto>(eventDesc);
            if (eventLiked)
                liked.IsFavorite = true;

            liked.EventDescId = eventDesc.EventDescription.Id;

            return _mapper.Map<EventDescDto>(liked);
        }

        public async Task<IEnumerable<TagsDto>> GetEventTags()
        {
            var tags = await _dbContext
                .Tags
                .ToListAsync();

            return _mapper.Map<IEnumerable<TagsDto>>(tags);
        }

        public async Task<IEnumerable<CommentDto>> GetComments(int eventId)
        {
            var comments = await _dbContext
                .Comments
                .Where(e => e.EventDescriptionId == eventId)
                .OrderByDescending(c => c.Timestamp)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> AddComment(int eventId, string content, int userId, string username, string userPic)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found");

            Comment newComment = new Comment();
            newComment.UserId = user.Id;
            newComment.Content = content;
            newComment.Username = username;
            newComment.UserPic = user.UserPic;
            newComment.Timestamp = DateTime.Now;
            newComment.EventDescriptionId = eventId;

            try
            {
                _dbContext.Add(newComment);
                _dbContext.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return _mapper.Map<CommentDto>(newComment);
        }

        public async Task<IEnumerable<EventDto>> GetFavEvents(int userId)
        {
            var favList = await _dbContext
                .Events
                .Where(l => l.LikedByUsers.Any(r => r.Id == userId))
                .OrderBy(d => d.Date)
                .ToListAsync();

            var favListReturn = _mapper.Map<IEnumerable<EventDto>>(favList);

            foreach (var item in favListReturn)
            {
                item.IsFavorite = true;
            }

            return favListReturn;
        }
        
            public async Task<int> AddFavEvent(int eventId, int userId)
        {
            var eventLiked = await _dbContext
                .Events
                .Where(e => e.Id == eventId)
                .AnyAsync(e => e.LikedByUsers.Any(u => u.Id == userId));

            if(eventLiked)
                throw new NotFoundException("Event is already liked");

            var user = await _dbContext
                .Users
                .Include(u => u.LikedEvents)
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found");
           
            var favAdd = await _dbContext
                .Events
                .FindAsync(eventId) ?? throw new NotFoundException("Event not found");


            try
            {
                favAdd.FollowersCount++;
                user.LikedEvents.Add(favAdd);
                await _dbContext.SaveChangesAsync();
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
            
            return favAdd.Id;
        }

        public async Task<int> DeleteFavEvent(int eventId, int userId)
        {
            var eventLiked = await _dbContext
               .Events
               .Where(e => e.Id == eventId)
               .AnyAsync(e => e.LikedByUsers.Any(u => u.Id == userId));

            if (!eventLiked)
                throw new NotFoundException("Event is not already liked");

            var user = await _dbContext
                .Users
                .Include(u => u.LikedEvents)
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found");

            var favDelete = await _dbContext
                .Events
                .FindAsync(eventId) ?? throw new NotFoundException("Event not found");

            try
            {
                favDelete.FollowersCount--;
                user.LikedEvents.Remove(favDelete);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return favDelete.Id;
        }

        public async Task<int> AddEvent(AddEventDto addEvent, bool userAdmin)
        {
            if (addEvent.PhotoURL != null &&
                (System.IO.Path.GetExtension(addEvent.PhotoURL.FileName) != ".jpg" &&
               System.IO.Path.GetExtension(addEvent.PhotoURL.FileName) != ".jpeg" &&
               System.IO.Path.GetExtension(addEvent.PhotoURL.FileName) != ".bmp" &&
               System.IO.Path.GetExtension(addEvent.PhotoURL.FileName) != ".png"))
                throw new NotFoundException("Niepoprawny format zdjęcia.");

            Event eventToSave = _mapper.Map<Event>(addEvent);
            EventDescription eventDescToSave = _mapper.Map<EventDescription>(addEvent);

            eventToSave.FollowersCount = 0;
            eventToSave.Date = DateTime.Parse(addEvent.Date).AddHours(12);
            eventToSave.Tags = new List<Tag>();
            eventToSave.IsVerified = userAdmin;

            try
            {
                eventToSave.Image = await uploadPhoto(addEvent.PhotoURL);
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }

            List<int> tagsList = null;

            if (addEvent.EventTags != null)
                tagsList = addEvent.EventTags.Split(',').Select(int.Parse).ToList();

            

            if (tagsList != null && tagsList.Any())
            {
                foreach (var tagDto in tagsList)
                {
                    
                    var tag = await _dbContext.Tags.FirstOrDefaultAsync(r => tagDto == r.Id);
                    if (tag != null) {
                        
                        eventToSave.Tags.Add(tag);
                    }

                }
            }

            try
            { 
                await _dbContext.AddAsync(eventToSave);
                await _dbContext.SaveChangesAsync();

                eventDescToSave.EventId = eventToSave.Id;
                await _dbContext.AddAsync(eventDescToSave);
                await _dbContext.SaveChangesAsync();

                return eventToSave.Id;

            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

       

        public async Task<string> uploadPhoto(IFormFile file)
        {
            var stream = file.OpenReadStream();

            var task = new FirebaseStorage(DatabaseLink.StorageAddress)
             .Child("images")
             .Child("events")
             .Child(GenerateRandomString() + System.IO.Path.GetExtension(file.FileName))
             .PutAsync(stream);

            //task.Progress.ProgressChanged += (s, e) => Console.WriteLine($"Progress: {e.Percentage} %");

            var downloadUrl = await task;

            return downloadUrl;
        }

        public string GenerateRandomString()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            return new string(Enumerable.Repeat(chars, 20)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
