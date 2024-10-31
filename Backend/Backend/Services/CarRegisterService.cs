using AutoMapper;
using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Backend.Exceptions;
using Microsoft.Extensions.FileProviders.Physical;
using Backend.Migrations;
using Microsoft.OpenApi.Writers;

namespace Backend.Services
{
    public interface ICarRegisterService
    {
        Task<IEnumerable<CarExpenseDto>> GetAllExpenses(int userId);
        Task<CarExpenseDto> AddExpense(AddCarExpenseDto expense, int userId);
        Task<CarRegistryDto> GetCarRegistry(int userId);
        Task<int> AddCarRegistry(AddCarRegistryDto dto, int userId);
        Task<CarExpenseDto> PatchExpense(UpdateCarExpenseDto expense);
        Task<string> DeleteExpense(int id);
    }

    public class CarRegisterService : ICarRegisterService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;

        public CarRegisterService(EventsDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarExpenseDto>> GetAllExpenses(int userId)
        {
            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return _mapper.Map<List<CarExpenseDto>>(list);
        }

        public async Task<CarExpenseDto> AddExpense(AddCarExpenseDto expense, int userId)
        {
            CarExpense carExpense = new CarExpense();

            carExpense.UserId = userId;
            carExpense.Type = expense.Type;
            carExpense.Price = (float)Math.Round(expense.Price, 2);
            carExpense.Date = DateTime.Parse(expense.Date);
            carExpense.Description = expense.Description;

            try
            {
                _dbContext.Add(carExpense);
                _dbContext.SaveChanges();
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }

            return _mapper.Map<CarExpenseDto>(carExpense);
        }

        public async Task<CarExpenseDto> PatchExpense(UpdateCarExpenseDto expense)
        {
            var carExpense = await _dbContext
                .CarExpenses
                .Where(r => r.Id == expense.Id)
                .FirstOrDefaultAsync();

            if (carExpense == null)
                throw new Exception("Nie znaleziono wydatku.");
            carExpense.Type = expense.Type;
            carExpense.Price = (float)Math.Round(expense.Price, 2);
            carExpense.Date = expense.Date;
            carExpense.Description = expense.Description;


            try
            {
                _dbContext.Add(carExpense);
                _dbContext.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return _mapper.Map<CarExpenseDto>(carExpense);
        }

        public async Task<string> DeleteExpense(int id)
        {
            var carExpense = await _dbContext
                .CarExpenses
                .Where(r => r.Id == id)
                .FirstOrDefaultAsync();


            if (carExpense == null)
                throw new Exception("Nie znaleziono wydatku.");

            try
            {
                _dbContext.Remove(carExpense);
                _dbContext.SaveChanges();
            }catch(Exception e)
            {
                throw new Exception("Nie udało się usunąć wpisu.");
            }

            return "Usunięto wpis.";
        }

        public async Task<CarRegistryDto> GetCarRegistry(int userId)
        {
            var registry = await _dbContext
                .CarRegistries
                .Where(c => c.UserId == userId)
                .FirstOrDefaultAsync();

            CarRegistry carRegistry = new CarRegistry();

            if(registry is null)
            {
                carRegistry.Course = 0;
                carRegistry.EngineOil = 0;
                carRegistry.TransmissionOil = 0;
                carRegistry.Tech = DateTime.Now;
                carRegistry.Insurance = DateTime.Now;
                carRegistry.UserId = userId;

                try
                {
                    _dbContext.Add(carRegistry);
                    _dbContext.SaveChanges();
                    return _mapper.Map<CarRegistryDto>(carRegistry);
                }catch(Exception e)
                {
                    throw new Exception(e.Message);
                }
            }

            return _mapper.Map<CarRegistryDto>(registry);
        }

        public async Task<int> AddCarRegistry(AddCarRegistryDto dto, int userId)
        {
            var registry = await _dbContext
                .CarRegistries
                .Where(c => c.UserId == userId)
                .FirstOrDefaultAsync();

            registry.Course = dto.Course;
            registry.EngineOil = dto.EngineOil;
            registry.TransmissionOil = dto.TransmissionOil;
            registry.Tech = DateTime.Parse(dto.Tech);
            registry.Insurance = DateTime.Parse(dto.Insurance);

            try
            {
                _dbContext.Update(registry);   
                _dbContext.SaveChanges();
                return registry.Id;
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
