using AutoMapper;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Firebase.Auth;
using Firebase.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Backend.Services
{
    public interface IAdminService
    {
        Task<string> VerifyEvent(int eventId);
        Task<AdminDataPageDto<UnverifiedEventDto>> GetUnverifiedEvents(int pageIndex, int pageSize);
        Task<string> DeleteEvent(int eventId);
        Task<EditEventDto> GetEventToEdit(int eventId);
        Task<string> EditEvent(EditEventFormDto data);
        Task<AdminDataPageDto<UnverifiedWorkshopDto>> GetUnverifiedWorkshops(int pageIndex, int pageSize);
        Task<string> VerifyWorkshop(int workshopId);
        Task<string> DeleteWorkshop(int workshopId);
        Task<EditWorkshopDto> GetWorkshopToEdit(int workshopId);
        Task<string> EditWorkshop(EditWorkshopFormDto data);
        Task<AdminDataPageDto<UserDataDto>> GetUsersData(int userId, int pageIndex, int pageSize);
        Task<string> PromoteUser(int id);
        Task<string> DemoteUser(int id);
    }
    public class AdminService: IAdminService
    {
        private readonly EventsDbContext _dbContext;
        private readonly IMapper _mapper;
        private Random random = new Random();
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
                throw new Exception("Event not found");

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

        public async Task<AdminDataPageDto<UnverifiedEventDto>> GetUnverifiedEvents(int pageIndex, int pageSize)
        {
            var total = await _dbContext.Events.Where(x => !x.IsVerified).CountAsync();

            var events = await _dbContext
                .Events
                .Where(r => !r.IsVerified)
                .OrderBy(r => r.Date)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var list =  _mapper.Map<List<UnverifiedEventDto>>(events);

            return new AdminDataPageDto<UnverifiedEventDto>()
            {
                List = list,
                Total = total
            };
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
                throw new Exception("Event not found");

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

        public async Task<EditEventDto> GetEventToEdit(int eventId)
        {
            var eventToEdit = await _dbContext
                .Events
                .Include(e => e.EventDescription)
                .Include(e => e.Tags)
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventToEdit == null)
                throw new Exception("Event not found");

            return _mapper.Map<EditEventDto>(eventToEdit);
        }

        public async Task<string> EditEvent(EditEventFormDto data)
        {
            var eventToEdit = await _dbContext
                .Events
                .Include(e => e.Tags)
                .FirstOrDefaultAsync(e => e.Id == data.Id);
            
            if (eventToEdit == null)
                throw new Exception("Event not found");

            var eventDescToEdit = await _dbContext
                .EventDescriptions
                .FirstOrDefaultAsync(e => e.EventId == data.Id);

            if (eventDescToEdit == null)
                throw new Exception("Event not found");


            eventToEdit.Name = data.Name;
            eventToEdit.Date = DateTime.Parse(data.Date).AddHours(12);
            eventToEdit.Location = data.Location;     
            eventToEdit.Voivodeship = data.Voivodeship;


            eventToEdit.Tags.Clear();
            List<int> tagsList = null;
            List<Tag> allTags = await _dbContext
                .Tags
                .ToListAsync();

            List<Tag> newTags = new List<Tag>();

            if (data.Tags != null)
                tagsList = data.Tags.Split(',').Select(int.Parse).ToList();

            if (tagsList != null && tagsList.Any())
            {
                foreach (var tagDto in tagsList)
                {
                    var tag = allTags.FirstOrDefault(t => t.Id == tagDto);
                    if (tag != null)
                        newTags.Add(tag);
                }
            }
            eventToEdit.Tags = newTags;

            eventDescToEdit.Address = data.Address;
            eventDescToEdit.Description = data.Description;
            eventToEdit.IsVerified = true;

            if (data.PhotoURL != null &&
               (System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".jpg" &&
              System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".jpeg" &&
              System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".bmp" &&
              System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".png"))
                throw new NotFoundException("Niepoprawny format zdjęcia.");

            try
            {
                if (data.PhotoURL != null)
                    eventToEdit.Image = await uploadPhoto(data.PhotoURL);
                

                _dbContext.Update(eventToEdit);
                await _dbContext.SaveChangesAsync();

                _dbContext.Update(eventDescToEdit);
                await _dbContext.SaveChangesAsync();

                return "Ok.";
            }
            catch (Exception e)
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

        public async Task<AdminDataPageDto<UnverifiedWorkshopDto>> GetUnverifiedWorkshops(int pageIndex, int pageSize)
        {
            var total = await _dbContext.Workshops.Where(x => !x.IsVerified).CountAsync();

            var workshops = await _dbContext
                .Workshops
                .Where(r => !r.IsVerified)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var list = _mapper.Map<List<UnverifiedWorkshopDto>>(workshops);

            return new AdminDataPageDto<UnverifiedWorkshopDto>()
            {
                List = list,
                Total = total
            };
        }

        public async Task<string> VerifyWorkshop(int workshopId)
        {
            var workshopToVerify = await _dbContext
                .Workshops
                .FirstOrDefaultAsync(r => r.Id == workshopId);

            if (workshopToVerify == null)
                throw new Exception("Workshop not found");

            workshopToVerify.IsVerified = true;

            try
            {
                _dbContext.Update(workshopToVerify);
                await _dbContext.SaveChangesAsync();
                return "Ok";
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<string> DeleteWorkshop(int workshopId)
        {
            var workshopToDelete = await _dbContext
             .Workshops
             .Include(e => e.WorkshopDescription)
             .ThenInclude(ed => ed.WorkshopsComments)
             .Include(e => e.WorkshopRatings)
             .Include(e => e.Tags)
             .FirstOrDefaultAsync(e => e.Id == workshopId);

            if (workshopToDelete == null)
                throw new Exception("Workshop not found");

            try
            {
                workshopToDelete.Tags.Clear();

                workshopToDelete.WorkshopRatings.Clear();

                if (workshopToDelete.WorkshopDescription != null)
                {
                    _dbContext.WorkshopComments.RemoveRange(workshopToDelete.WorkshopDescription.WorkshopsComments);
                    _dbContext.WorkshopDescriptions.Remove(workshopToDelete.WorkshopDescription);
                }

                _dbContext.Workshops.Remove(workshopToDelete);

                await _dbContext.SaveChangesAsync();

                return "Ok";
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<EditWorkshopDto> GetWorkshopToEdit(int workshopId)
        {
            var workshopToEdit = await _dbContext
                .Workshops
                .Include(e => e.WorkshopDescription)
                .Include(e => e.Tags)
                .FirstOrDefaultAsync(e => e.Id == workshopId);

            if (workshopToEdit == null)
                throw new Exception("Workshop not found");

            return _mapper.Map<EditWorkshopDto>(workshopToEdit);
        }

        public async Task<string> EditWorkshop(EditWorkshopFormDto data)
        {
            var workshopToEdit = await _dbContext
                .Workshops
                .Include(e => e.Tags)
                .FirstOrDefaultAsync(e => e.Id == data.Id);

            if (workshopToEdit == null)
                throw new Exception("Workshop not found");

            var workshopDescToEdit = await _dbContext
                .WorkshopDescriptions
                .FirstOrDefaultAsync(e => e.WorkshopId == data.Id);

            if (workshopDescToEdit == null)
                throw new Exception("Workshop not found");


            workshopToEdit.Name = data.Name;
            workshopToEdit.Location = data.Location;
            workshopToEdit.Voivodeship = data.Voivodeship;


            workshopToEdit.Tags.Clear();
            List<int> tagsList = null;
            List<WorkshopTag> allTags = await _dbContext
                .WorkshopTags
                .ToListAsync();

            List<WorkshopTag> newTags = new List<WorkshopTag>();

            if (data.Tags != null)
                tagsList = data.Tags.Split(',').Select(int.Parse).ToList();

            if (tagsList != null && tagsList.Any())
            {
                foreach (var tagDto in tagsList)
                {
                    var tag = allTags.FirstOrDefault(t => t.Id == tagDto);
                    if (tag != null)
                        newTags.Add(tag);
                }
            }
            workshopToEdit.Tags = newTags;

            workshopDescToEdit.Address = data.Address;
            workshopDescToEdit.Description = data.Description;
            workshopToEdit.IsVerified = true;

            if (data.PhotoURL != null &&
               (System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".jpg" &&
              System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".jpeg" &&
              System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".bmp" &&
              System.IO.Path.GetExtension(data.PhotoURL.FileName) != ".png"))
                throw new NotFoundException("Niepoprawny format zdjęcia.");

            try
            {
                if (data.PhotoURL != null)
                    workshopToEdit.Image = await uploadPhoto(data.PhotoURL);


                _dbContext.Update(workshopToEdit);
                await _dbContext.SaveChangesAsync();

                _dbContext.Update(workshopDescToEdit);
                await _dbContext.SaveChangesAsync();

                return "Ok.";
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.WriteLine();
                Console.WriteLine(e.Message);
                throw new Exception(e.Message);
            }
        }

        public async Task<AdminDataPageDto<UserDataDto>> GetUsersData(int userId, int pageIndex, int pageSize)
        {
            var total = await _dbContext.Users.Where(x => x.Id != userId).CountAsync();

            var users = await _dbContext
                .Users
                .Where(x => x.Id != userId)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var list = _mapper.Map<List<UserDataDto>>(users);

            return new AdminDataPageDto<UserDataDto>()
            {
                List = list,
                Total = total
            };
        }

        public async Task<string> PromoteUser(int id)
        {
            var user = await _dbContext
                .Users
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (user == null)
                throw new Exception("User not found");

            user.IsAdmin = true;

            try
            {
                _dbContext.Update(user);
                await _dbContext.SaveChangesAsync();

                return "Ok";
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> DemoteUser(int id)
        {
            var user = await _dbContext
                .Users
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (user == null)
                throw new Exception("User not found");

            user.IsAdmin = false;

            try
            {
                _dbContext.Update(user);
                await _dbContext.SaveChangesAsync();

                return "Ok";
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
