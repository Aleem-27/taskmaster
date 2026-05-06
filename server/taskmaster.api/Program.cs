using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using taskmaster.api.Data;
using taskmaster.api.Repositories.Implementations;
using taskmaster.api.Repositories.Interfaces;
using taskmaster.api.Services.Implementations;
using taskmaster.api.Services.Interfaces;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting TaskMaster API");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, config) =>
        config.ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext());

    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddRouting(options => options.LowercaseUrls = true);

    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)),
                ValidateIssuer = false,
                ValidateAudience = false
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["accessToken"];
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    Log.Warning("JWT Authentication failed: {Error}", context.Exception.Message);
                    return Task.CompletedTask;
                }
            };
        });

    builder.Services.AddScoped<ITaskRepository, TaskRepository>();
    builder.Services.AddScoped<ITaskService, TaskService>();
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IAuthService, AuthService>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowViteApp", policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
        });
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors("AllowViteApp");
    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "TaskMaster API failed to start");
}
finally
{
    Log.CloseAndFlush();
}
