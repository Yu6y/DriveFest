using AutoMapper;
using Backend.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore.Design;
namespace Backend
{
    public class EventMappingProfile: Profile
    {
        public EventMappingProfile() {
            CreateMap<Event, EventDescDto>()
                 .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.EventDescription.Address))
                 .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.EventDescription.Description));

            CreateMap<Event, EventDto>()
             .ForMember(dto => dto.Tags, opt => opt.MapFrom(src => src.Tags));

            CreateMap<Tag, TagsDto>()
                .ForMember(dto => dto.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dto => dto.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<WorkshopTag, TagsDto>()
                .ForMember(dto => dto.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dto => dto.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<Comment, CommentDto>();
            CreateMap<WorkshopComment, CommentDto>();

            CreateMap<User, UserDto>();

            CreateMap<AddEventDto, Event>()
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.City));
            

            CreateMap<AddEventDto, EventDescription>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Desc));

            CreateMap<AddWorkshopDto, Workshop>()
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.City));
            

            CreateMap<AddWorkshopDto, WorkshopDescription>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Desc));

            CreateMap<Workshop, WorkshopDto>();
            CreateMap<Workshop, WorkshopDescDto>()
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.WorkshopDescription.Address))
                 .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.WorkshopDescription.Description));

            CreateMap<CarExpense, CarExpenseDto>();

            CreateMap<CarRegistry, CarRegistryDto>();
        }
    }
}

