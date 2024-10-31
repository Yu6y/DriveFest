using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/register")]
    [Authorize]
    public class CarRegisterController: BaseController
    {
        private readonly ICarRegisterService _registerService;

        public CarRegisterController(ICarRegisterService registerService)
        {
            _registerService = registerService;
        }

        [HttpGet("expense")]
        public async Task<IActionResult> GetAllExpenses()
        {
            try
            {
                var expensesList = await _registerService.GetAllExpenses(GetUserId());
                return new ObjectResult(expensesList) { StatusCode = 200 };
            }catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("expense")]
        public async Task<IActionResult> AddExpense([FromBody] AddCarExpenseDto expense)
        {
            try
            {
                var result = await _registerService.AddExpense(expense, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPatch("expense")]
        public async Task<IActionResult> UpdateExpense([FromBody]UpdateCarExpenseDto expense)
        {
            try
            {
                var result = await _registerService.PatchExpense(expense);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpDelete("expense/{id}")]
        public async Task<IActionResult> DeleteExpense([FromRoute]int id)
        {
            try
            {
                var result = await _registerService.DeleteExpense(id);
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("registry")]
        public async Task<IActionResult> GetRegistry()
        {
            var registry = await _registerService.GetCarRegistry(GetUserId());
            return new ObjectResult(registry) { StatusCode = 200 };
        }

        [HttpPost("registry")]
        public async Task<IActionResult> AddRegistry([FromBody] AddCarRegistryDto dto)
        {
            try
            {
                var result = await _registerService.AddCarRegistry(dto, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
        }
    }
}
