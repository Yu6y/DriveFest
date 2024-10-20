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
        Task<string> AddEvent(AddEventDto addEvent);
    }

    public class EventService : IEventService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;

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
        //??????????????????????????????????????????????????
        public async Task<IEnumerable<EventDto>> GetEventsFiltered(string searchTerm, string dateFrom, string dateTo, string sortBy, string tags, string voivodeships, int userId)
        {
            DateTime dateFromNew, dateToNew;
            if (!(DateTime.TryParse(dateFrom, out dateFromNew) && DateTime.TryParse(dateTo, out dateToNew)))
                throw new NotFoundException("Given date error");

            List<int> tagsList = null;
            List<string> voivodeshipsList = null;

            if(tags != null)
                tagsList = tags.Split(',').Select(int.Parse).ToList();
            if(voivodeships != null)
                voivodeshipsList = voivodeships.Split(',').ToList();
            /*
            //List<Event> query;
            var query = _dbContext
                    .Events
                    .Include(e => e.Tags)
                    .Where(r => r.Date > dateFromNew && r.Date < dateToNew)
                    .Where(c => EF.Functions.Like(c.Name, $"%{searchTerm}%"));

            if (tagsList != null)
            {
               query = query.Where(e => e.Tags.Any(t => tagsList.Contains(t.Id)));
            }

            if (voivodeshipsList != null)
            {
               query = query.Where(e => voivodeshipsList.Contains(e.Voivodeship));
            }


            if (sortBy == "NONE")
                query.ToList();

            else if (sortBy == "ASC")
                query.OrderBy(c => c.Date).ToList();
            else
                query.OrderByDescending(c => c.Date).ToList();*/

            List<Event> list;
            if (sortBy == "NONE") {
                var query = _dbContext
                     .Events
                     .Include(e => e.Tags)
                     .Where(r => r.Date > dateFromNew && r.Date < dateToNew)
                     .Where(c => EF.Functions.Like(c.Name, $"%{searchTerm}%"));


                if (tagsList != null)
                {
                    query = query.Where(e => e.Tags.Any(t => tagsList.Contains(t.Id)));
                }

                if (voivodeshipsList != null)
                {
                    query = query.Where(e => voivodeshipsList.Contains(e.Voivodeship));
                }
                list = query.ToList();
            }
            else if (sortBy == "ASC")
            {
                    var query = _dbContext
                         .Events
                         .Include(e => e.Tags)
                         .Where(r => r.Date > dateFromNew && r.Date < dateToNew)
                         .Where(c => EF.Functions.Like(c.Name, $"%{searchTerm}%"));


                    if (tagsList != null)
                    {
                        query = query.Where(e => e.Tags.Any(t => tagsList.Contains(t.Id)));
                    }

                    if (voivodeshipsList != null)
                    {
                        query = query.Where(e => voivodeshipsList.Contains(e.Voivodeship));
                    }
                list = query.OrderBy(c => c.Date).ToList();
          
            }

            else
            {
                var query = _dbContext
                         .Events
                         .Include(e => e.Tags)
                         .Where(r => r.Date > dateFromNew && r.Date < dateToNew)
                         .Where(c => EF.Functions.Like(c.Name, $"%{searchTerm}%"));


                if (tagsList != null)
                {
                    query = query.Where(e => e.Tags.Any(t => tagsList.Contains(t.Id)));
                }

                if (voivodeshipsList != null)
                {
                    query = query.Where(e => voivodeshipsList.Contains(e.Voivodeship));
                }
                list = query.OrderByDescending(c => c.Date).ToList();

            }


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
            if(!eventExist)
                throw new NotFoundException("Resource not found");

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
                throw new NotFoundException(e.Message);
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
                throw new NotFoundException(e.Message);
            }

            return favDelete.Id;
        }

        public async Task<string> AddEvent(AddEventDto addEvent)
        {
            Event eventToSave = _mapper.Map<Event>(addEvent);
            EventDescription eventDescToSave = _mapper.Map<EventDescription>(addEvent);

            eventToSave.FollowersCount = 0;
            eventToSave.Date = DateTime.Parse(addEvent.Date).AddHours(12);
            eventToSave.Tags = new List<Tag>();

            try
            { 
                await _dbContext.AddAsync(eventToSave);
                await _dbContext.SaveChangesAsync();

                eventDescToSave.EventId = eventToSave.Id;
                await _dbContext.AddAsync(eventDescToSave);

                if (addEvent.Tags != null && addEvent.Tags.Any())
                {
                    foreach (var tagDto in addEvent.Tags)
                    {
                        var tag = await _dbContext.Tags.FindAsync(tagDto.Id);
                        if (tag != null)            
                            eventToSave.Tags.Add(tag);
                        
                    }
                }

                await _dbContext.SaveChangesAsync();

                return "Dodano wydarzenie!";

            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
