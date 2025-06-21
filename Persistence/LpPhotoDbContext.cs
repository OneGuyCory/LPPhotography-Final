using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class LpPhotoDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Gallery> Galleries { get; set; }
    
}