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
using System;
using Firebase.Storage;
using Microsoft.Identity.Client;

namespace Backend.Services
{
    public interface ICarRegisterService
    {
        Task<IEnumerable<CarExpenseDto>> GetAllExpenses(string filters,int carId, int userId);
        Task<CarExpenseDto> AddExpense(AddCarExpenseDto expense,int carId, int userId);
        Task<CarRegistryDto> GetCarRegistry(int carId, int userId);
        Task<CarRegistryDto> AddCarRegistry(AddCarRegistryDto dto,int carId, int userId);
        Task<CarExpenseDto> PatchExpense(UpdateCarExpenseDto expense, int userId);
        Task<string> DeleteExpense(int id, int userId);
        Task<string> DeleteAllExpenses(int carId, int userId);
        Task<string> DeleteCarRegistry(int carId, int userId);
        Task<IEnumerable<string>> GetExpensesYears(string types, int carId, int userId);
        Task<IEnumerable<ChartData>> GetChart(string filters, int carId, int year, int userId);
        Task<UserCarDto> AddUserCar(AddUserCarDto userCar, int userId);
        Task<UserCarDto> EditUserCar(EditUserCarDto userCar, int userId);
        Task<IEnumerable<UserCarDto>> GetUserCars(int userId);
        Task<string> DeleteUserCar(int carId, int userId);
    }

    public class CarRegisterService : ICarRegisterService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;
        private Random random = new Random();

        public CarRegisterService(EventsDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CarExpenseDto>> GetAllExpenses(string filters, int carId, int userId)
        {       
            List<string> types = null;

            if (filters != null)
                types = filters.Split(',').ToList();
            else return [];

            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId && types.Contains(x.Type) && x.UserCarId == carId)
                .OrderByDescending(x => x.Date)
                .ToListAsync();

            return _mapper.Map<List<CarExpenseDto>>(list);
        }

        public async Task<CarExpenseDto> AddExpense(AddCarExpenseDto expense, int carId, int userId)
        {
            CarExpense carExpense = new CarExpense();

            carExpense.UserId = userId;
            carExpense.UserCarId = carId;
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

        public async Task<CarExpenseDto> PatchExpense(UpdateCarExpenseDto expense, int userId)
        {
            var carExpense = await _dbContext
                .CarExpenses
                .Where(r => r.Id == expense.Id && r.UserId == userId)
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

        public async Task<string> DeleteExpense(int id, int userId)
        {
            var carExpense = await _dbContext
                .CarExpenses
                .Where(r => r.Id == id && r.UserId == userId)
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

        public async Task<string> DeleteAllExpenses(int carId, int userId) {
            var expenses = await _dbContext
                .CarExpenses
                .Where(u => u.UserId == userId && u.UserCarId == carId)
                .ToListAsync();

            if (expenses.Count == 0)
                return "Brak danych do usunięcia.";

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

        public async Task<CarRegistryDto> GetCarRegistry(int carId, int userId)
        {
            var registry = await _dbContext
                .CarRegistries
                .Where(c => c.UserId == userId && c.UserCarId == carId)
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
                carRegistry.UserCarId = carId;

                try
                {
                    _dbContext.Add(carRegistry);
                    _dbContext.SaveChanges();
                    return _mapper.Map<CarRegistryDto>(carRegistry);
                }catch(Exception e)
                {
                    Console.WriteLine(e);
                    throw new Exception(e.Message);
                }
            }

            return _mapper.Map<CarRegistryDto>(registry);
        }

        public async Task<CarRegistryDto> AddCarRegistry(AddCarRegistryDto dto,int carId, int userId)
        {
            var registry = await _dbContext
                .CarRegistries
                .Where(c => c.UserId == userId && c.UserCarId == carId)
                .FirstOrDefaultAsync();
            int temp;
            if(!int.TryParse(dto.Course, out temp))
                throw new NotFoundException("Podane dane są niepoporawne");
            if(!int.TryParse(dto.Course, out temp))
                throw new NotFoundException("Podane dane są niepoporawne");
            if (!int.TryParse(dto.Course, out temp))
                throw new NotFoundException("Podane dane są niepoporawne");
            if (!int.TryParse(dto.Course, out temp))
                throw new NotFoundException("Podane dane są niepoporawne");

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
            registry.UserCarId = carId;

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

        public async Task<string> DeleteCarRegistry(int carId, int userId)
        {
            var entry = await _dbContext
                .CarRegistries
                .Where(r => r.UserId == userId && r.UserCarId == carId)
                .FirstOrDefaultAsync();

            if (entry == null)
                return "Brak danych do usunięcia.";

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

        public async Task<IEnumerable<string>> GetExpensesYears(string filters,int carId, int userId){
            
            List<string> types = null;

            if (filters != null)
                types = filters.Split(',').ToList();
            else return [];

            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId && types.Contains(x.Type) && x.UserCarId == carId)
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

        public async Task<IEnumerable<ChartData>> GetChart(string filters,int carId, int year, int userId)
        {
            List<string> types = null;

            if (filters != null)
                types = filters.Split(',').ToList();
            else return [];

            var list = await _dbContext
                .CarExpenses
                .Where(x => x.UserId == userId && types.Contains(x.Type) && x.Date.Year == year && x.UserCarId == carId)
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
        public async Task<IEnumerable<UserCarDto>> GetUserCars(int userId)
        {
            var list = await _dbContext
                .UserCars
                .Where(r => r.UserId == userId)
                .OrderBy(r => r.Name)
                .ToListAsync();

            if (list == null)
                return [];

            return _mapper.Map<List<UserCarDto>>(list);
        }

        public async Task<UserCarDto> AddUserCar(AddUserCarDto userCar, int userId)
        {
            if (userCar.PhotoUrl != null &&
                (System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".jpg" &&
               System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".jpeg" &&
               System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".bmp" &&
               System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".png"))
                throw new NotFoundException("Niepoprawny format zdjęcia.");

            UserCar car = _mapper.Map<UserCar>(userCar);

            car.UserId = userId;
            

            try
            {
                if (userCar.PhotoUrl != null)
                    car.PhotoUrl = await uploadPhoto(userCar.PhotoUrl);
                else
                    car.PhotoUrl = "https://firebasestorage.googleapis.com/v0/b/moto-event.appspot.com/o/images%2Fcars%2Fdefault.jpg?alt=media&token=0be8ca50-a828-473b-b717-52e830085de2";

                await _dbContext.AddAsync(car);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<UserCarDto>(car);
            }catch(Exception e)
            {
                Console.WriteLine(e);
                throw new Exception(e.Message);
            }
        }

        public async Task<UserCarDto> EditUserCar(EditUserCarDto userCar, int userId)
        {
            if (userCar.PhotoUrl != null &&
                (System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".jpg" &&
                System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".jpeg" &&
                System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".bmp" &&
                System.IO.Path.GetExtension(userCar.PhotoUrl.FileName) != ".png"))
                throw new NotFoundException("Niepoprawny format zdjęcia.");

            if (!int.TryParse(userCar.Id, out int carId))
                throw new NotFoundException("Podane Id pojazdu jest niepoprawne.");
 
            var car = await _dbContext
                .UserCars
                .Where(r => r.Id == carId && r.UserId == userId)
                .FirstOrDefaultAsync();

            if (car == null)
                throw new NotFoundException("Nie znaleziono pojazdu.");

            car.Name = userCar.Name;
            try
            {                    
                if (userCar.PhotoUrl!= null)
                    car.PhotoUrl = await uploadPhoto(userCar.PhotoUrl);

                _dbContext.Update(car);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<UserCarDto>(car);
                
            }catch(Exception e)
            {
                Console.WriteLine(e);
                throw new Exception(e.Message);
            }
        }

        public async Task<string> DeleteUserCar(int carId, int userId)
        {
            var carToDelete = await _dbContext
                .UserCars
                .Where(r => r.UserId == userId && r.Id == carId)
                .FirstOrDefaultAsync();

            if (carToDelete == null)
                throw new NotFoundException("Wpis nie istnieje");

            try
            {
                await DeleteAllExpenses(carId, userId);
                await DeleteCarRegistry(carId, userId);

                _dbContext.Remove(carToDelete);
                await _dbContext.SaveChangesAsync();

                return "Usunięto dane.";
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw new Exception(e.Message);
            }
        }

        public async Task<string> uploadPhoto(IFormFile file)
        {
            var stream = file.OpenReadStream();

            var task = new FirebaseStorage(DatabaseLink.StorageAddress)
             .Child("images")
             .Child("cars")
             .Child(GenerateRandomString() + System.IO.Path.GetExtension(file.FileName))
             .PutAsync(stream);

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
