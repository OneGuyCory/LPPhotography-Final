namespace LPPhotographyAPI.DTOs;

/// <summary>
/// Data Transfer Object used when a client logs in with their email and access code.
/// </summary>
public class ClientLoginDto
{
    /// <summary>
    /// The client's email address. This is used as the unique identifier for the client user.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// The access code provided to the client, used to authenticate their private gallery access.
    /// </summary>
    public string AccessCode { get; set; } = string.Empty;
}