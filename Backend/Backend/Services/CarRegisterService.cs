using AutoMapper;
using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Backend.Exceptions;
using Microsoft.Extensions.FileProviders.Physical;
using Backend.Migrations;
using Microsoft.OpenApi.Writers;
using System.Diagnostics;
using System.Globalization;

namespace Backend.Services
{
    public interface ICarRegisterService
    {
        Task<IEnumerable<CarExpenseDto>> GetAllExpenses(string filters, int userId);
        Task<CarExpenseDto> AddExpense(AddCarExpenseDto expense, int userId);
        Task<CarRegistryDto> GetCarRegistry(int userId);
        Task<CarRegistryDto> AddCarRegistry(AddCarRegistryDto dto, int userId);
        Task<CarExpenseDto> PatchExpense(UpdateCarExpenseDto expense);
        Task<string> DeleteExpense(int id);
        Task<string> DeleteAllExpenses(int userId);
        Task<string> DeleteCarRegistry(int userId);
        Task<IEnumerable<string>> GetExpensesYears(string types, int userId);
        Task<IEnumerable<ChartData>> GetChart(string filters, int year, int userId);
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

        public async Task<IEnumerable<CarExpenseDto>> GetAllExpenses(string filters, int userId)
        {
            List<string> types = null;

            if (filters != null)
                types = filters.Split(',').ToList();
            else return [];

            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId && types.Contains(x.Type))
                .OrderByDescending(x => x.Date)
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
                throw new NotFoundException("Nie znaleziono wydatku.");

            carExpense.Type = expense.Type;
            carExpense.Price = expense.Price;
            carExpense.Date = expense.Date;
            carExpense.Description = expense.Description;


            try
            {
                _dbContext.Update(carExpense);
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
                throw new NotFoundException("Nie znaleziono wydatku.");

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

        public async Task<string> DeleteAllExpenses(int userId) {
            var expenses = await _dbContext
                .CarExpenses
                .Where(u => u.UserId == userId)
                .ToListAsync();

            if (expenses.Count == 0)
                throw new Exception("Brak danych.");

            try
            {
                _dbContext.RemoveRange(expenses);
                _dbContext.SaveChanges();

                return "Usunięto dane.";
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
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
                carRegistry.Course = "0";
                carRegistry.Insurance = null;
                carRegistry.Tech = null;
                carRegistry.EngineOil = "0";
                carRegistry.TransmissionOil = "0";
                carRegistry.Brakes = "0";
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

        public async Task<CarRegistryDto> AddCarRegistry(AddCarRegistryDto dto, int userId)
        {
            var registry = await _dbContext
                .CarRegistries
                .Where(c => c.UserId == userId)
                .FirstOrDefaultAsync();

            registry.Course = dto.Course;
            DateTime date;
            if (!DateTime.TryParse(dto.Insurance, out date) && dto.Insurance != null)
                throw new NotFoundException("Podana data jest niepoporawna");
            if(dto.Insurance == null)
                registry.Insurance = null;
            else
                registry.Insurance = date;
            if (!DateTime.TryParse(dto.Tech, out date) && dto.Tech != null)
                throw new NotFoundException("Podana data jest niepoporawna");
            if(dto.Tech == null)
                registry.Tech = null;
            else
                registry.Tech = date;
            registry.EngineOil = dto.EngineOil;
            registry.TransmissionOil = dto.TransmissionOil;
            registry.Brakes = dto.Brakes;

            try
            {
                _dbContext.Update(registry);   
                _dbContext.SaveChanges();

                return _mapper.Map<CarRegistryDto>(registry);
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<string> DeleteCarRegistry(int userId)
        {
            var entry = await _dbContext
                .CarRegistries
                .Where(r => r.UserId == userId)
                .FirstOrDefaultAsync();

            if (entry == null)
                throw new NotFoundException("Wpis nie istnieje");

            try
            {
                _dbContext.Remove(entry);
                await _dbContext.SaveChangesAsync();

                return "Usunięto dane.";
            }catch(Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<IEnumerable<string>> GetExpensesYears(string filters, int userId){
            
            List<string> types = null;

            if (filters != null)
                types = filters.Split(',').ToList();
            else return [];

            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId && types.Contains(x.Type))
                .OrderByDescending(x => x.Date)
                .ToListAsync();
            List<string> years = new List<string>();


            list.ForEach (x =>
            {
                if (!years.Contains(x.Date.Year.ToString()))
                {
                    years.Add(x.Date.Year.ToString());
                }
            });

            return years;
        }

        public async Task<IEnumerable<ChartData>> GetChart(string filters, int year, int userId)
        {
            List<string> types = null;

            if (filters != null)
                types = filters.Split(',').ToList();
            else return [];

            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId && types.Contains(x.Type) && x.Date.Year == year)
                .OrderByDescending(x => x.Date)
                .ToListAsync();

            List<ChartData> data = new List<ChartData>();

            for(int i = 1; i <= 12; i++)
            {
                DateTime date = new DateTime(2024, i, 1);
                data.Add(new ChartData()
                {
                    Month = date.ToString("MMMM", new CultureInfo("pl-PL")),
                    Fuel = 0,
                    Service = 0,
                    Parking = 0,
                    Other = 0,
                    Sum = 0
                });
            }

            list.ForEach(x =>
            {
                if (x.Type == "Tankowanie")
                    data[x.Date.Month - 1].Fuel += x.Price;
                else if (x.Type == "Serwis")
                    data[x.Date.Month - 1].Service += x.Price;
                else if (x.Type == "Parking")
                    data[x.Date.Month - 1].Parking += x.Price;

                else
                    data[x.Date.Month - 1].Other += x.Price;
                data[x.Date.Month - 1].Sum += x.Price;
            });
            
            return data;
        }
    }
}
