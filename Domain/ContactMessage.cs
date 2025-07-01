using System.Text.Json.Serialization;

namespace Domain;

/// <summary>
/// Represents a message submitted via the contact form on the website.
/// Captures the sender's details, the type of service they're interested in, and their message content.
/// </summary>
public class ContactMessage
{
    /// <summary>
    /// Primary key for the message in the database.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The name of the person who submitted the contact form.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// The sender's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// The service the sender is inquiring about (e.g. Weddings, Portraits).
    /// Bound to "Service" key in the JSON payload via JsonPropertyName.
    /// </summary>
    [JsonPropertyName("Service")]
    public string ServiceType { get; set; } = string.Empty;

    /// <summary>
    /// The message content provided by the user.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Timestamp indicating when the message was sent. Defaults to current UTC time.
    /// </summary>
    public DateTime Sent { get; set; } = DateTime.UtcNow;
}