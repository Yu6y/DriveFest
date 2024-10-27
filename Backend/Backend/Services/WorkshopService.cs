using AutoMapper;
using Backend.Models;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Exceptions;

namespace Backend.Services
{
    public interface IWorkshopService
    {
        Task<IEnumerable<WorkshopDto>> GetAllWorkshops();
        Task<IEnumerable<TagsDto>> GetWorkshopTags();
        Task<IEnumerable<WorkshopDto>> GetFilteredWorkshops(string searchTerm, string sortBy, string tags, string voivodeships, int userId);
        Task<WorkshopDescDto> GetWorkshopDesc(int id);
        Task<IEnumerable<CommentDto>> GetComments(int workshopId);
        Task<CommentDto> AddComment(int workshopId, string content, int userId, string username, string userPic);
        Task<int> AddWorkshop(AddWorkshopDto addWorkshop);
    }

    public class WorkshopService : IWorkshopService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;
        public WorkshopService(EventsDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<WorkshopDto>> GetAllWorkshops()
        {
            var list = await _dbContext
                .Workshops
                .Include(c => c.Tags)
                .ToListAsync();

            return _mapper.Map<List<WorkshopDto>>(list);
        }

        public async Task<IEnumerable<TagsDto>> GetWorkshopTags()
        {
            var tags = await _dbContext
               .WorkshopTags
               .ToListAsync();

            return _mapper.Map<IEnumerable<TagsDto>>(tags);
        }

        public async Task<IEnumerable<WorkshopDto>> GetFilteredWorkshops(string searchTerm, string sortBy, string tags, string voivodeships, int userId)
        {
            List<int> tagsList = null;
            List<string> voivodeshipsList = null;

            if (tags != null)
                tagsList = tags.Split(',').Select(int.Parse).ToList();
            if (voivodeships != null)
                voivodeshipsList = voivodeships.Split(',').ToList();
            
            //List<Event> query;
            var query = _dbContext
                    .Workshops
                    .Include(e => e.Tags)
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
                await query.ToListAsync();

            else if (sortBy == "ASC")
                await query.OrderBy(c => c.Rate).ToListAsync();
            else
                await query.OrderByDescending(c => c.Rate).ToListAsync();

            return _mapper.Map<List<WorkshopDto>>(query);
        }

        public async Task<WorkshopDescDto> GetWorkshopDesc(int id)
        {
            var workshop = await _dbContext
                .WorkshopDescriptions
                .AnyAsync(r => r.WorkshopId == id);
            
            if (!workshop)
                throw new NotFoundException("Resource not found");

            var workshopDesc = await _dbContext
                .Workshops
                .Include(e => e.WorkshopDescription)
                .Include(e => e.Tags)
                .FirstOrDefaultAsync(r => r.Id == id);

            

            var result =  _mapper.Map<WorkshopDescDto>(workshopDesc);

            result.WorkshopDescId = workshopDesc.WorkshopDescription.Id;

            return result;
        }

        public async Task<IEnumerable<CommentDto>> GetComments(int workshopId)
        {
            var comments = await _dbContext
                .WorkshopComments
                .Where(e => e.WorkshopDescriptionId == workshopId)
                .OrderByDescending(c => c.Timestamp)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> AddComment(int workshopId, string content, int userId, string username, string userPic)
        {
            var user = await _dbContext
                .Users
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found");

            WorkshopComment newComment = new WorkshopComment();
            newComment.UserId = user.Id;
            newComment.Content = content;
            newComment.Username = username;
            newComment.UserPic = user.UserPic;
            newComment.Timestamp = DateTime.Now;
            newComment.WorkshopDescriptionId = workshopId;

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

        public async Task<int> AddWorkshop(AddWorkshopDto addWorkshop)
        {
            Workshop workshopToSave = _mapper.Map<Workshop>(addWorkshop);
            WorkshopDescription wrkshopDescToSave = _mapper.Map<WorkshopDescription>(addWorkshop);

            workshopToSave.Tags = new List<WorkshopTag>();

            try
            {
                await _dbContext.AddAsync(workshopToSave);
                await _dbContext.SaveChangesAsync();

                Console.WriteLine("cos");

                wrkshopDescToSave.WorkshopId = workshopToSave.Id;
                await _dbContext.AddAsync(wrkshopDescToSave);


                if (addWorkshop.Tags != null && addWorkshop.Tags.Any())
                {
                    foreach (var tagDto in addWorkshop.Tags)
                    {
                        var tag = await _dbContext.WorkshopTags.FindAsync(tagDto.Id);
                        if (tag != null)
                            workshopToSave.Tags.Add(tag);

                    }
                }

                await _dbContext.SaveChangesAsync();
                return workshopToSave.Id;
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
