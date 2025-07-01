using Microsoft.AspNetCore.Identity;

namespace Domain;

/// <summary>
/// Represents an authenticated user in the system. Inherits from IdentityUser to integrate with ASP.NET Identity.
/// Adds additional properties to support roles, display names, and access control for private galleries.
/// </summary>
public class SiteUser : IdentityUser
{
    /// <summary>
    /// Optional display name for the user, useful for showing a friendly name on the frontend.
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// Role of the user: either "Admin" or "Client". Defaults to "Client".
    /// Used to determine what parts of the app they can access.
    /// </summary>
    public string Role { get; set; } = "Client"; // Default role

    /// <summary>
    /// Optional access code for client users to access their private gallery.
    /// Admins won't use this.
    /// </summary>
    public string? AccessCode { get; set; }
}