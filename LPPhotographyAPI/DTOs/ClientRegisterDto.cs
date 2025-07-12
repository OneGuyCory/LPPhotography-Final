namespace LPPhotographyAPI.DTOs;
// Data Transfer Object used for registering a new client.
public class ClientRegisterDto
{
    // The client's email address. This serves as both the username and email for login purposes.
    public required string Email { get; set; }
    // The password the client will use to log in.
    public required string Password { get; set; }
    
    // A unique access code tied to a private gallery.
    // This is required to authenticate the client and associate them with the correct gallery.
    public required string AccessCode { get; set; }
}