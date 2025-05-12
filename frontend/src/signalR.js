import * as signalR from "@microsoft/signalr";

const API_URL = "https://localhost:7243/productHub"; // ✅ Đúng URL SignalR của backend

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(API_URL, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000]) // ✅ Tự động reconnect
    .configureLogging(signalR.LogLevel.Information) // ✅ Log chi tiết
    .build();

// ✅ Tự động kết nối
const startConnection = async () => {
    try {
        await hubConnection.start();
        console.log("✅ Connected to SignalR Hub");
    } catch (err) {
        console.error("❌ SignalR Error:", err);
        setTimeout(startConnection, 5000); // ✅ Thử kết nối lại sau 5 giây
    }
};

startConnection();

export default hubConnection;
