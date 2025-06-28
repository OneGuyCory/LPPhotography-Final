using Microsoft.AspNetCore.Identity;

namespace Domain;

public class SiteUser : IdentityUser
{
    public string? DisplayName { get; set; }
    public string Role { get; set; } = "Client"; //default
    public string? AccessCode { get; set; }

}