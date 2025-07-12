namespace LPPhotographyAPI.DTOs;

// Data Transfer Object used when a client logs in with their email and access code.
public class ClientLoginDto
{
    // The client's email address. This is used as the unique identifier for the client user.
    public string Email { get; set; } = string.Empty;
    
    // The access code provided to the client, used to authenticate their private gallery access.
    public string AccessCode { get; set; } = string.Empty;
}