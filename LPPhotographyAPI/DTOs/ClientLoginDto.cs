namespace LPPhotographyAPI.DTOs;

public class ClientLoginDto
{
    public string Email { get; set; } = string.Empty;
    public string AccessCode { get; set; } = string.Empty;
}