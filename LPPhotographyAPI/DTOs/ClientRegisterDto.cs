namespace LPPhotographyAPI.DTOs;

/// <summary>
/// Data Transfer Object used for registering a new client.
/// </summary>
public class ClientRegisterDto
{
    /// <summary>
    /// The client's email address. This serves as both the username and email for login purposes.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// The password the client will use to log in.
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    /// A unique access code tied to a private gallery.
    /// This is required to authenticate the client and associate them with the correct gallery.
    /// </summary>
    public required string AccessCode { get; set; }
}