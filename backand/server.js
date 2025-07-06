const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const productRoutes = require("./routes/productRoute");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes=require("./routes/order")
const review=require("./routes/reviewRoutes")

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session Configuration
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/review",review)

app.get("/",(req,res)=>{
  res.send("get api")
})

// Connect DB and Start Server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongo connected");
    app.listen(process.env.PORT, () => {
      console.log("app is listening");
    });
  })
  .catch((err) => console.log(err));
