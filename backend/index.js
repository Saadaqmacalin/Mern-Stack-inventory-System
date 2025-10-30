require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const userRouter = require("./routers/userRoute");
const connectDB = require("./db/connectDB");

app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

start();
