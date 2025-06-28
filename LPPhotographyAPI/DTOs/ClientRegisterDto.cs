namespace LPPhotographyAPI.DTOs;

public class ClientRegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string AccessCode { get; set; } = string.Empty;
}