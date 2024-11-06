using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;

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
        public async Task<IActionResult> GetAllExpenses([FromQuery] string? filters)
        {
            try
            {
                var expensesList = await _registerService.GetAllExpenses(filters, GetUserId());
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
                return new ObjectResult(e.Message) { StatusCode = 404 };
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
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
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
            catch (NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpDelete("expense")]
        public async Task<IActionResult> DeleteAllExpenses(){
            try
            {
                var result = await _registerService.DeleteAllExpenses(GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpGet("expense/years")]
        public async Task<IActionResult> GetExpensesYears([FromQuery] string filters)
        {
            try
            {
                var result = await _registerService.GetExpensesYears(filters, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("expense/chart")]
        public async Task<IActionResult> GetChartData([FromQuery]string filters, [FromQuery]int year)
        {
            try
            {
                var result = await _registerService.GetChart(filters, year, GetUserId());
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
            try
            {
                var registry = await _registerService.GetCarRegistry(GetUserId());
                return new ObjectResult(registry) { StatusCode = 200 };
            }catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("registry")]
        public async Task<IActionResult> AddRegistry([FromBody] AddCarRegistryDto dto)
        {
            try
            {
                var result = await _registerService.AddCarRegistry(dto, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch(NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpDelete("registry")]
        public async Task<IActionResult> DeleteRegistry()
        {
            try
            {
                var result = await _registerService.DeleteCarRegistry(GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }catch(NotFoundException e)
            {
                return new ObjectResult(e.Message) { StatusCode = 404 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }
    }
}
