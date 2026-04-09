import express from "express";
import cors from "cors";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import checkoutRoutes from "./routes/checkout";
import adminRoutes from "./routes/admin";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
