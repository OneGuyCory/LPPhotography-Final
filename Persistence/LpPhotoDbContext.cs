using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class LpPhotoDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Gallery> Galleries { get; set; }
    public required DbSet<Photo> Photos { get; set; }
    public DbSet<User> Users { get; set; }
}