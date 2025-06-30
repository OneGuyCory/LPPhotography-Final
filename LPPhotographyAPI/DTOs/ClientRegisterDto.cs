namespace LPPhotographyAPI.DTOs;

public class ClientRegisterDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string AccessCode { get; set; }
}