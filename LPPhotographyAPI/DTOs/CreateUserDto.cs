namespace LPPhotographyAPI.DTOs;

// Data Transfer Object for creating a new user. Admin or Client.
public class CreateUserDto
{
    // The email address of the user to create.
    // This becomes both the email and the username in the system.
    public string Email { get; set; }
    
    //The password assigned to the new user.
    public string Password { get; set; }
    
    // The role to assign to the user. Admin or Client
    public string Role { get; set; }
}