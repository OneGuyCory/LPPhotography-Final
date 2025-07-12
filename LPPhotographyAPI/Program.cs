using Domain; // Imports your custom domain models (e.g. SiteUser)
using Microsoft.AspNetCore.Identity; // Identity for user and role management
using Microsoft.EntityFrameworkCore; // Entity Framework Core for DB access
using Persistence; // Your DbContext and database logic
using System.Text.Json.Serialization; // Controls JSON serialization settings
using Microsoft.AspNetCore.Authentication.Cookies; // Cookie authentication

// Create a builder to configure the app and its services
var builder = WebApplication.CreateBuilder(args);

// Get the connection string from appsettings.json (MySQL in this case)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Specify the version of MySQL server being used
var serverVersion = new MySqlServerVersion(new Version(8, 0, 34));

// --------------------------
// Register services
// --------------------------

// Add controller support and configure JSON to avoid cycles (e.g. navigation properties)
builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Register your EF Core DbContext with MySQL
builder.Services.AddDbContext<LpPhotoDbContext>(options =>
    options.UseMySql(connectionString, serverVersion));

// Allow frontend (like React) to access your API
builder.Services.AddCors();

// Enable cookie-based authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login"; // Redirect to this path if unauthenticated
        options.AccessDeniedPath = "/access-denied"; // If role/permissions don't match
    });

// Define authorization policies by role
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ClientPolicy", policy => policy.RequireRole("Client"));
});

// Setup ASP.NET Identity with custom user class (SiteUser)
builder.Services.AddIdentityApiEndpoints<SiteUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>() // Add role support
.AddEntityFrameworkStores<LpPhotoDbContext>(); // Use EF Core for storage

// --------------------------
// Build the application
// --------------------------
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


// --------------------------
// Configure the HTTP request pipeline
// --------------------------

// CORS policy - allow your frontend (React on port 3000) to make authenticated requests
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:3000", "https://localhost:3000", "https://lpphotography.azurewebsites.net")
    .AllowCredentials());

// Enable authentication and authorization middlewares
app.UseAuthentication();
app.UseAuthorization();

// Map controller endpoints (e.g. /api/users)
app.MapControllers();
app.MapFallbackToFile("index.html");

// Map Identity endpoints (like login, register) under /api prefix
app.MapGroup("api").MapIdentityApi<SiteUser>();

// --------------------------
// Initialize database and seed roles/users
// --------------------------

// Create a scoped service provider to access services during startup
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    // Run EF Core migrations to ensure DB is up-to-date
    var context = services.GetRequiredService<LpPhotoDbContext>();
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Connection string in Azure: {conn}", connectionString);

    await context.Database.MigrateAsync();

    // Seed roles and optionally an initial admin user
    var userManager = services.GetRequiredService<UserManager<SiteUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();

    await DbInitializer.SeedRolesAndUsers(userManager, roleManager, loggerFactory, context);
}
catch (Exception ex)
{
    // Log any errors during migration or seeding
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

// Run the web app
app.Run();
