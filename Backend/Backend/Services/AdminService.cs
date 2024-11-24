using AutoMapper;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Firebase.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace Backend.Services
{
    public interface IAdminService
    {
        Task<string> VerifyEvent(int eventId);
        Task<IEnumerable<UnverifiedEventsDto>> GetUnverifiedEvents();
        Task<string> DeleteEvent(int eventId);
    }
    public class AdminService: IAdminService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;

        public AdminService(EventsDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<string> VerifyEvent(int eventId)
        {
            var eventToVerify = await _dbContext
                .Events
                .FirstOrDefaultAsync(r => r.Id == eventId);

            if (eventToVerify == null)
                throw new NotFoundException("Event not found");

            eventToVerify.IsVerified = true;

            try
            {
                _dbContext.Update(eventToVerify);
                await _dbContext.SaveChangesAsync();
                return "Ok";
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<IEnumerable<UnverifiedEventsDto>> GetUnverifiedEvents()
        {
            var events = await _dbContext
                .Events
                .Where(r => !r.IsVerified)
                .OrderBy(r => r.Date)
                .ToListAsync();

            return _mapper.Map<List<UnverifiedEventsDto>>(events);
        }

        public async Task<string> DeleteEvent(int eventId)
        {
            var eventToDelete = await _dbContext.Events
             .Include(e => e.EventDescription)
             .ThenInclude(ed => ed.Comments)
             .Include(e => e.LikedByUsers)
             .Include(e => e.Tags) 
             .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventToDelete == null)
                throw new NotFoundException("Event not found");

            try
            {
                eventToDelete.Tags.Clear();

                eventToDelete.LikedByUsers.Clear();

                if (eventToDelete.EventDescription != null)
                {
                    _dbContext.Comments.RemoveRange(eventToDelete.EventDescription.Comments);
                    _dbContext.EventDescriptions.Remove(eventToDelete.EventDescription);
                }

                _dbContext.Events.Remove(eventToDelete);

                await _dbContext.SaveChangesAsync();

                return "Ok";
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
