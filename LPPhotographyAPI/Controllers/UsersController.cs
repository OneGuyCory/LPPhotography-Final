using Domain;
using LPPhotographyAPI.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace LPPhotographyAPI.Controllers;

public class UsersController(UserManager<SiteUser> userManager, SignInManager<SiteUser> signInManager) : BaseApiController
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return Unauthorized("Invalid Credentials");
        }
        
        var result = await signInManager.PasswordSignInAsync(user,loginDto.Password, isPersistent: false, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid Credentials");
        }
        
        return Ok(new {message = "Successfully logged in", role = (await userManager.GetRolesAsync(user)).FirstOrDefault()});
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok(new  {message = "Successfully logged out"});
    }

    [HttpPost("register")]
    public async Task<IActionResult> CreateUser(CreateUserDto userDto)
    {
        var user = new SiteUser
        {
            UserName = userDto.Email,
            Email = userDto.Email
        };
        
        var result = await userManager.CreateAsync(user, userDto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await userManager.AddToRoleAsync(user, userDto.Role);
        return Ok(new {message = "Successfully registered"});
    }
    
    [HttpPost("register-client")]
    public async Task<IActionResult> RegisterClient(ClientRegisterDto clientDto)
    {
        var user = new SiteUser
        {
            UserName = clientDto.Email,
            Email = clientDto.Email
            // Optionally: store access code in a separate field if needed
        };

        var result = await userManager.CreateAsync(user, clientDto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await userManager.AddToRoleAsync(user, "Client");

        // You can store the access code in a separate DB table or field,
        // or use claims/metadata if needed to link them to a gallery

        return Ok(new { message = "Client registered successfully" });
    }
    
    [HttpPost("login-client")]
    public async Task<IActionResult> LoginClient(ClientLoginDto dto)
    {
        // Step 1: Find the user by email
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null || user.AccessCode != dto.AccessCode)
        {
            return Unauthorized("Invalid access credentials.");
        }

        // Step 2: Sign in the user (without password)
        await signInManager.SignInAsync(user, isPersistent: false);

        return Ok(new
        {
            message = "Access granted",
            email = user.Email,
            role = "Client"
        });
    }

    }