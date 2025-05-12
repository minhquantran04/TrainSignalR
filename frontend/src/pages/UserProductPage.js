import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import hubConnection from "../signalR";
import axios from "axios";
import { Container, Typography } from "@mui/material";

const API_URL = "https://localhost:7243/api/Product"; // ✅ Fix API URL

const UserProductPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(API_URL);
                setProducts(res.data);
            } catch (err) {
                console.error("❌ Error fetching products:", err);
            }
        };

        fetchProducts(); // Lấy danh sách sản phẩm ban đầu

        // Lắng nghe cập nhật từ SignalR
        const handleProductUpdate = (updatedProducts) => {
            setProducts(updatedProducts);
        };

        hubConnection.on("ReceiveProductUpdate", handleProductUpdate);
        hubConnection.start().catch((err) => console.error("❌ SignalR Error:", err));

        return () => {
            hubConnection.off("ReceiveProductUpdate", handleProductUpdate);
        };
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>User Product View</Typography>
            {products.length > 0 ? (
                <ProductList products={products} />
            ) : (
                <Typography variant="body1" color="textSecondary">No products available</Typography>
            )}
        </Container>
    );
};

export default UserProductPage;
