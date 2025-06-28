using System.Text.Json.Serialization;

namespace Domain;

public class ContactMessage
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("Service")]
    public string ServiceType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Sent { get; set; } = DateTime.UtcNow;
}