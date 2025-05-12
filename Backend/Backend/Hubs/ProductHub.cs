using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class ProductHub : Hub
    {
        public async Task SendProductUpdate()
        {
            await Clients.All.SendAsync("ReceiveProductUpdate");
        }
    }
}
