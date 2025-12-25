import "dotenv/config";
import cors from "cors";
import express from "express"; // Standard way to import express
const app = express();

// Middlewares and Routers
import authHeader from "./middlewares/authenticationHeader.js"; // Note: In ESM, sometimes .js extension is required depending on your config
import userRouter from "./routers/userRoute.js";
import categoryRouter from "./routers/categoryRouter.js";
import productsRouters from "./routers/productsRouters.js";
import suppliersRouters from "./routers/suppliersRouters.js";
import connectDB from "./db/connectDB.js";

// Middleware configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // Use express.json() directly

// Routes
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productsRouters);
app.use("/api/suppliers", suppliersRouters);

const port = process.env.PORT || 5000;

async function start() {
  try {
    // Ensure MONGO_URL exists in your .env file
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
}

start();