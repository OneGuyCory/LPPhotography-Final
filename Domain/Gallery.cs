namespace Domain;

public class Gallery
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string? Title { get; set; } //title for client specific gallery
    
    public required string Category { get; set; } // what kind of gallery
    
    public bool IsPrivate { get; set; } = false; //set to false so only need to make changes when doing client gallery
    
    public bool? AccessCode { get; set; } // does it have an access code for client gallery

    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    
    //public List<Photo> Photos { get; set; }
}