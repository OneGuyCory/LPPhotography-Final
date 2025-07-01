namespace LPPhotographyAPI.DTOs;

/// <summary>
/// Data Transfer Object for creating a new user (Admin or Client).
/// Used by administrators to manually register users.
/// </summary>
public class CreateUserDto
{
    /// <summary>
    /// The email address of the user to create.
    /// This becomes both the email and the username in the system.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// The password assigned to the new user.
    /// </summary>
    public string Password { get; set; }

    /// <summary>
    /// The role to assign to the user.
    /// Should be either "Admin" or "Client".
    /// </summary>
    public string Role { get; set; }
}