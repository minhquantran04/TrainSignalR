using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Hubs;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ProductDbContext _context;
    private readonly IHubContext<ProductHub> _hubContext;

    public ProductController(ProductDbContext context, IHubContext<ProductHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> AddProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // 🔄 Gửi cập nhật đến tất cả client
        await _hubContext.Clients.All.SendAsync("ReceiveProductUpdate", await _context.Products.ToListAsync());

        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null) return NotFound();

        existingProduct.Name = product.Name;
        existingProduct.Price = product.Price;
        await _context.SaveChangesAsync();

        // 🔄 Gửi cập nhật đến tất cả client
        await _hubContext.Clients.All.SendAsync("ReceiveProductUpdate", await _context.Products.ToListAsync());

        return Ok(existingProduct);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        // 🔄 Gửi cập nhật đến tất cả client
        await _hubContext.Clients.All.SendAsync("ReceiveProductUpdate", await _context.Products.ToListAsync());

        return Ok();
    }
}
