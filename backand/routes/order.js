const express=require("express")
const router=express.Router()
const Order=require("../models/Order")
const isLoggedIn=require("../middleware/isLoggedIn")

//place new order
router.post("/place",isLoggedIn,async(req,res)=>{
    try {
      const { items, totalAmount } = req.body;
      const order = new Order({
        user: req.session.userId,
        items,
        totalAmount,
      });
      
      await order.save();
      res.json({ message: "Order placed successfully", order });
    } catch (err) {
      console.error("Order placement error:", err);
      res.status(500).json({ error: "Failed to place order" });
    }
})

//get loggedin users orders
router.get("/my-orders",isLoggedIn,async(req,res)=>{
    try {
      const orders = await Order.find({ user: req.session.userId }).sort({
        createdAt: -1,
      });
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: "Failed to get orders" });
    }
})
module.exports = router;