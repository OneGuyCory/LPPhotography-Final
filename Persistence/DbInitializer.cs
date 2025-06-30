using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Persistence;

public class DbInitializer
{
    
     public static async Task SeedRolesAndUsers(
        UserManager<SiteUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILoggerFactory loggerFactory,
        LpPhotoDbContext context)
    {
        
        try
        {
            // 1. Create roles if they don't exist
            var roles = new[] { "Admin", "Client" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Create an admin user if not exists
            if (await userManager.FindByEmailAsync("admin@example.com") == null)
            {
                var admin = new SiteUser()
                {
                    UserName = "admin@example.com",
                    Email = "admin@example.com",
                    DisplayName = "Photographer Admin"
                };

                var result = await userManager.CreateAsync(admin, "AdminPass123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }

            // 3. Create a test client user
            if (await userManager.FindByEmailAsync("client@example.com") == null)
            {
                var client = new SiteUser()
                {
                    UserName = "client@example.com",
                    Email = "client@example.com",
                    DisplayName = "Client Test",
                    AccessCode = "SECRET123"
                };
                
                

                var result = await userManager.CreateAsync(client, "ClientPass123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(client, "Client");
                }
            }
            
            // 4. Seed a private gallery for the test client
            // 4. Create a private gallery tied to the test client
            if (!context.Galleries.Any(g => g.ClientEmail == "client@example.com"))
            {
                var galleryId = Guid.NewGuid();

                var gallery = new Gallery
                {
                    Id = galleryId,
                    Title = "Client Wedding Gallery",
                    Category = "Weddings",
                    IsPrivate = true,
                    AccessCode = "SECRET123", // matches the user's access code
                    ClientEmail = "client@example.com",
                    CreatedAt = DateTime.UtcNow,
                    Photos = new List<Photo>
                    {
                        new Photo
                        {
                            Id = Guid.NewGuid(),
                            Url = "https://res.cloudinary.com/dxqrgfgqo/image/upload/v1751082971/20240224_150835_mk2io6.jpg",
                            Caption = "Eye",
                            GalleryId = galleryId 
                        }
                    }
                };

                context.Galleries.Add(gallery);
                await context.SaveChangesAsync();
            }


            
        }
        catch (Exception ex)
        {
            var logger = loggerFactory.CreateLogger<DbInitializer>();
            logger.LogError(ex, "An error occurred seeding the DB.");
        }

        
    }
     
     
     
}