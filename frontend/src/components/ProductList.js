import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const ProductList = ({ products }) => {
    return (
        <List>
            {products.map((product) => (
                <ListItem key={product.id} divider>
                    <ListItemText primary={product.name} secondary={`Price: $${product.price}`} />
                </ListItem>
            ))}
        </List>
    );
};

export default ProductList;
