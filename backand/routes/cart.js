const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/add", async (req, res) => {
  const user = req.session.user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "Login required" });
  }

  const { productId, size, quantity } = req.body;
  const qty = parseInt(quantity);
  if (!productId || !size || !qty || qty <= 0) {
    return res
      .status(400)
      .json({ error: "Missing or invalid product, size, or quantity" });
  }

  try {
    let cart = await Cart.findOne({ userId: user.id }); // ✅ FIXED

    if (!cart) {
      cart = new Cart({
        userId: user.id, // ✅ FIXED
        items: [{ productId, size, quantity: qty }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({ productId, size, quantity: qty });
      }
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: user.id }).populate(
      "items.productId"
    );
    res.json({ cartItems: updatedCart.items });

  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/", async (req, res) => {
  const user = req.session.user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const cart = await Cart.findOne({ userId: user.id }).populate(
      "items.productId"
    );

    if (!cart) return res.json({ cartItems: [] });

    // ✅ Filter out invalid (null) productId entries
    const validItems = (cart.items || []).filter(
      (item) => item.productId !== null
    );

    res.json({ cartItems: validItems }); // ✅ Return only valid items
  } catch (err) {
    console.error("Fetch cart error", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.post("/remove", async (req, res) => {
  const user = req.session.user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "Login required" });
  }

  const { productId, size } = req.body;
  if (!productId || !size) {
    return res.status(400).json({ error: "Missing product or size" });
  }

  try {
    let cart = await Cart.findOne({ userId: user.id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove cart error", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
