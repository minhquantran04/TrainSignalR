import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const ProductForm = ({ onSubmit, initialProduct }) => {
    const [product, setProduct] = useState(initialProduct || { name: "", price: "" });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(product);
        }}>
            <TextField name="name" label="Product Name" value={product.name} onChange={handleChange} required fullWidth />
            <TextField name="price" label="Price" type="number" value={product.price} onChange={handleChange} required fullWidth />
            <Button type="submit" variant="contained" color="primary">Save</Button>
        </form>
    );
};

export default ProductForm;
