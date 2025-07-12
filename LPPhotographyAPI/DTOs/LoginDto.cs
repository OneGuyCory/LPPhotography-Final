namespace LPPhotographyAPI.DTOs;
// Data Transfer Object used for standard user login (Admin or Client).
public class LoginDto
{
    // The email address associated with the user's account.
    // This is used as the username for login.
    public string Email { get; set; }
    
    // The password entered by the user.
    public string Password { get; set; }
}