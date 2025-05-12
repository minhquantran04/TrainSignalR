using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// 🟢 Kết nối Database (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Server=localhost;Database=ProductDb;User Id=sa;Password=123;TrustServerCertificate=True";

builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(connectionString)
);

// 🟢 Cấu hình CORS (cho phép frontend React truy cập)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // ✅ Quan trọng cho SignalR
        });
});

// 🟢 Thêm Controllers + SignalR
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend API", Version = "v1" });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ProductHub>("/productHub"); // ✅ Thêm SignalR Hub

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1");
        c.RoutePrefix = "swagger";
    });
}

app.Run();
