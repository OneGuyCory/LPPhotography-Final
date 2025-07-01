namespace LPPhotographyAPI.DTOs;

/// <summary>
/// Data Transfer Object used for standard user login (Admin or Client).
/// This is submitted from the login form to validate user credentials.
/// </summary>
public class LoginDto
{
    /// <summary>
    /// The email address associated with the user's account.
    /// This is used as the username for login.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// The password entered by the user.
    /// </summary>
    public string Password { get; set; }
}