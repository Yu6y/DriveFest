using AutoMapper;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics.Tracing;
using System.Linq.Expressions;
using System.Reflection.Metadata;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/event")]
    [Authorize]
    public class EventController : BaseController
    {
        private readonly IEventService _eventService;
        public EventController(IEventService eventService)
        {
            this._eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
            try
            {
                var eventsList = await _eventService.GetAllEvents(GetUserId());
                return new ObjectResult(eventsList) { StatusCode = 200 };
            }catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("filters")]        
        public async Task<IActionResult> GetEventsFiltered(
            [FromQuery] string searchTerm,
            [FromQuery] string dateFrom,
            [FromQuery] string dateTo,
            [FromQuery] string sortBy,
            [FromQuery] string? tags,
            [FromQuery] string? voivodeships)
        {
            try
            {
                var eventsList = await _eventService.GetEventsFiltered(searchTerm, dateFrom, dateTo, sortBy, tags, voivodeships, GetUserId());
                return new ObjectResult(eventsList) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
            
        }


        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetEventDesc([FromRoute]int eventId)
        {
            try
            {
                var eventDesc = await _eventService.GetEventDesc(eventId, GetUserId());
                return new ObjectResult(eventDesc) { StatusCode = 200 };
            }
            catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("tags")]
        public async Task<IActionResult> GetEventTags()
        {
            try
            {
                var eventTags = await _eventService.GetEventTags();
                return new ObjectResult(eventTags) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("{eventId}/comments")]
        public async Task<IActionResult> GetEventComments([FromRoute] int eventId)
        {
            try
            {
                var eventComments = await _eventService.GetComments(eventId);
                return new ObjectResult(eventComments) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
        }

        [HttpPost("{eventId}/comments")]
        public async Task<IActionResult> AddComment([FromRoute] int eventId, [FromBody] CommentContentDto comment)
        {
            try
            {
                var eventComments = await _eventService.AddComment(eventId, comment.content, GetUserId(), GetUsername(), GetUserPic());
                return new ObjectResult(eventComments) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavoritesEvents()
        {
            try
            {
                var events = await _eventService.GetFavEvents(GetUserId());
                return new ObjectResult(events) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("favorites")]
        public async Task<IActionResult> AddEventToFavorites([FromBody] FavEventDto favEvent)
        {
            try
            {
                var result = await _eventService.AddFavEvent(favEvent.eventId, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpDelete("favorites/{eventId}")]
        public async Task<IActionResult> DeleteFavoriteEvent([FromRoute] FavEventDto favEvent)
        {
            try
            {
                var result = await _eventService.DeleteFavEvent(favEvent.eventId, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddEvent([FromForm] AddEventDto eventDto)
        {
            try
            {
                var result = await _eventService.AddEvent(eventDto);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult("Nie udało się dodać wydarzenia!") { StatusCode = 402 };
            }
        }
    }
}
