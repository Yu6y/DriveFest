using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using System.Runtime.CompilerServices;

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

        [HttpGet("{carId}/expense")]
        public async Task<IActionResult> GetAllExpenses([FromQuery] string? filters, [FromRoute]int carId)
        {
            try
            {
                var expensesList = await _registerService.GetAllExpenses(filters, carId, GetUserId());
                return new ObjectResult(expensesList) { StatusCode = 200 };
            }catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("{carId}/expense")]
        public async Task<IActionResult> AddExpense([FromBody] AddCarExpenseDto expense, [FromRoute]int carId)
        {
            try
            {
                var result = await _registerService.AddExpense(expense, carId, GetUserId());
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
                var result = await _registerService.PatchExpense(expense, GetUserId());
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
                var result = await _registerService.DeleteExpense(id, GetUserId());
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

        [HttpDelete("{carId}/expense")]
        public async Task<IActionResult> DeleteAllExpenses([FromRoute]int carId){
            try
            {
                var result = await _registerService.DeleteAllExpenses(carId, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpGet("{carId}/expense/years")]
        public async Task<IActionResult> GetExpensesYears([FromQuery] string filters, [FromRoute] int carId)
        {
            try
            {
                var result = await _registerService.GetExpensesYears(filters, carId, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("{carId}/expense/chart")]
        public async Task<IActionResult> GetChartData([FromQuery]string filters, [FromQuery]int year, [FromRoute]int carId)
        {
            try
            {
                var result = await _registerService.GetChart(filters, carId, year, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpGet("{carId}/registry")]
        public async Task<IActionResult> GetRegistry([FromRoute]int carId)
        {
            try
            {
                var registry = await _registerService.GetCarRegistry(carId, GetUserId());
                return new ObjectResult(registry) { StatusCode = 200 };
            }catch(Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }

        [HttpPost("{carId}/registry")]
        public async Task<IActionResult> AddRegistry([FromBody] AddCarRegistryDto dto, [FromRoute]int carId)
        {
            try
            {
                var result = await _registerService.AddCarRegistry(dto, carId, GetUserId());
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

        [HttpDelete("{carId}/registry")]
        public async Task<IActionResult> DeleteRegistry([FromRoute] int carId)
        {
            try
            {
                var result = await _registerService.DeleteCarRegistry(carId, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 402 };
            }
        }

        [HttpGet("cars")]
        public async Task<IActionResult> GetCars()
        {
            try
            {
                var cars = await _registerService.GetUserCars(GetUserId());
                return new ObjectResult(cars) { StatusCode = 200 };
            }
            catch (Exception e)
            {
                return new ObjectResult(e.Message) { StatusCode = 500 };
            }
        }
        
        [HttpPost("cars")]
        public async Task<IActionResult> AddCar([FromForm]AddUserCarDto car)
        {
            try
            {
                var result = await _registerService.AddUserCar(car, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
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
        
        [HttpPatch("cars")]
        public async Task<IActionResult> EditCar([FromForm]EditUserCarDto car)
        {
            try
            {
                var result = await _registerService.EditUserCar(car, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
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

        [HttpDelete("cars/{carId}")]
        public async Task<IActionResult> DeleteCar([FromRoute]int carId)
        {
            try
            {
                var result = await _registerService.DeleteUserCar(carId, GetUserId());
                return new ObjectResult(result) { StatusCode = 200 };
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
    }
}
