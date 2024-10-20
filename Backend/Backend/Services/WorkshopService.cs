using AutoMapper;
using Backend.Models;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IWorkshopService
    {
        Task<IEnumerable<WorkshopDto>> GetAllWorkshops();
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
    }
}
