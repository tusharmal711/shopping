const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/product");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");

// Add product
router.post(
  "/add",
  isLoggedIn,
  isAdmin,
  upload.array("images", 4),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const price = Number(req.body.price);

      if (
        !title ||
        !description ||
        !req.files ||
        req.files.length === 0 ||
        isNaN(price)
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const imageUrls = req.files.map((file) => file.path);

      const product = new Product({
        title,
        description,
        price,
        images: imageUrls,
      });

      await product.save();
      res.json({ message: "Product saved", product });
    } catch (err) {
      res.status(500).json({ error: "Error adding product" });
    }
  }
);

// Get all products (showing only first image)
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    const simplified = products.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.images[0],
    }));
    res.json(simplified);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Full update
router.put("/update/:id", upload.array("images", 4), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ error: "Invalid ID" });

  try {
    const { title, description } = req.body;
    const price = Number(req.body.price);

    if (
      !title ||
      !description ||
      !req.files ||
      req.files.length === 0 ||
      isNaN(price)
    ) {
      return res.status(400).json({ error: "All fields required" });
    }

    const imageUrls = req.files.map((file) => file.path);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, images: imageUrls },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Updated", product });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

//for search
// GET /api/products?search=...
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let products;

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      products = await Product.find({
        $or: [{ title: regex }, { description: regex }]
      });
    } else {
      products = await Product.find();
    }

    const simplified = products.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.images?.[0] || ""
    }));

    res.json(simplified);
  } catch (err) {
    console.error("Product fetch failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Delete product
router.delete("/delete/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ error: "Invalid ID" });

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
