const express=require("express")
const router=express.Router()
const Review=require("../models/review")
const isLoggedIn=require("../middleware/isLoggedIn")

router.post("/:productId",isLoggedIn,async(req,res)=>{
    const{rating,comment}=req.body;
    const{productId}=req.params;

    if(!rating||rating<1||rating>5)
    {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
    }

    try{

        const existingReview=await Review.findOne({
            user:req.session.userId,
            product:productId,
        })

        if (existingReview) {
            return res.status(400).json({ error: "You already reviewed this product" });
        }

        const newReview=new Review({
            user:req.session.userId,
            product:productId,
            rating,
            comment,
        });
    
        await newReview.save();
        res.json({ message: "Review submitted", review: newReview });
    }
    catch(err)
    {
        console.error("Review error:", err);
        res.status(500).json({ error: "Failed to submit review" });
    }
})

router.get("/:productId",async(req,res)=>{
    try {
      const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "username")
        .sort({ createdAt: -1 });
      res.json({ reviews });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
})




module.exports=router