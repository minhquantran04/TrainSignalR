import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import hubConnection from "../signalR"; // ✅ Import kết nối SignalR
import axios from "axios";
import { Button, Container, Typography, Box } from "@mui/material";

const API_URL = "https://localhost:7243/api/Product"; // ✅ Đúng API backend

const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();

        const handleProductUpdate = (updatedProducts) => {
            setProducts(updatedProducts);
        };

        hubConnection.on("ReceiveProductUpdate", handleProductUpdate);
        hubConnection.start().catch((err) => console.error("❌ SignalR Error:", err));

        return () => {
            hubConnection.off("ReceiveProductUpdate", handleProductUpdate);
        };
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL);
            setProducts(res.data);
        } catch (err) {
            console.error("❌ Error fetching products:", err);
        }
    };

    const handleSave = async (product) => {
        try {
            if (product.id) {
                await axios.put(`${API_URL}/${product.id}`, product);
            } else {
                await axios.post(API_URL, product);
            }
            setEditingProduct(null);
        } catch (err) {
            console.error("❌ Error saving product:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (err) {
            console.error("❌ Error deleting product:", err);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Product Management
            </Typography>
            <ProductForm onSubmit={handleSave} initialProduct={editingProduct} />
            <ProductList products={products} />
            {products.length > 0 ? (
                products.map((product) => (
                    <Box key={product.id} className="product-container">
                        <Box>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body1">Price: ${product.price}</Typography>
                        </Box>
                        <Box className="product-actions">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => setEditingProduct(product)}
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={() => handleDelete(product.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No products available
                </Typography>
            )}
        </Container>
    );
};

export default AdminProductPage;
