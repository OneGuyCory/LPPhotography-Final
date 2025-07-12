using Domain;
using LPPhotographyAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;
// Handles user authentication, registration, and user management.
// Supports Admin and Client roles. Includes login, logout, and user CRUD actions.
public class UsersController(UserManager<SiteUser> userManager, SignInManager<SiteUser> signInManager) : BaseApiController
{
    // Logs in a user using their email and password.
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
            return Unauthorized("Invalid Credentials");

        var result = await signInManager.PasswordSignInAsync(user, loginDto.Password, isPersistent: false, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Unauthorized("Invalid Credentials");

        return Ok(new 
        {
            message = "Successfully logged in", 
            role = (await userManager.GetRolesAsync(user)).FirstOrDefault()
        });
    }
    
    // Logs out the currently signed-in user.
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok(new { message = "Successfully logged out" });
    }
    
    // Registers a new user with a role (Admin or Client)
    [HttpPost("register")]
    public async Task<IActionResult> CreateUser(CreateUserDto userDto)
    {
        var user = new SiteUser
        {
            UserName = userDto.Email,
            Email = userDto.Email,
        };

        var result = await userManager.CreateAsync(user, userDto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await userManager.AddToRoleAsync(user, userDto.Role);
        return Ok(new { message = "Successfully registered" });
    }
    
    // Registers a client user using email, password, and an access code.
    // Used by Admin to create client-specific logins.
    [HttpPost("register-client")]
    public async Task<IActionResult> RegisterClient(ClientRegisterDto clientDto)
    {
        var user = new SiteUser
        {
            UserName = clientDto.Email,
            Email = clientDto.Email,
            AccessCode = clientDto.AccessCode,
        };

        var result = await userManager.CreateAsync(user, clientDto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        await userManager.AddToRoleAsync(user, "Client");

        return Ok(new { message = "Client registered successfully" });
    }
    
    // Returns a list of all users with their role.
    // Admin use
    [HttpGet("all")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await userManager.Users.ToListAsync();
        var result = new List<object>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            result.Add(new
            {
                user.Id,
                user.Email,
                Role = roles.FirstOrDefault() ?? "None"
            });
        }

        return Ok(result);
    }
    
    // Allows a client to log in using email and access code (no password required).
    [HttpPost("login-client")]
    public async Task<IActionResult> LoginClient(ClientLoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null || user.AccessCode != dto.AccessCode)
            return Unauthorized("Invalid access credentials.");

        await signInManager.SignInAsync(user, isPersistent: false);

        return Ok(new
        {
            message = "Access granted",
            email = user.Email,
            role = "Client"
        });
    }
    
    // Deletes a user by ID. Requires Admin 
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("User not found.");

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "User deleted successfully" });
    }
}
