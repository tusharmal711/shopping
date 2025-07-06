const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


//Register
router.post('/register',async(req,res)=>{
    const {username,password,role}=req.body

    //basic field check
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    //password length
    if(password.length < 6)
    {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
    }
    //password strength : must contain uppercase lowercase and special character
    const hashUpper=/[A-Z]/.test(password)
    const hashLower=/[a-z]/.test(password)
    const hashSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if(!hashUpper||!hashLower||!hashSpecialChar)
    {
      return res.status(400).json({
        error:
          "Password must include at least one uppercase, one lowercase, and one special character",
      });
    }

    //role check
    const allowedRoles = ["admin", "user"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Role must be 'admin' or 'user'" });
    }

    try {
      //if already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      const hash = await bcrypt.hash(password, 10);
      const addUser = new User({ username, password: hash, role });
      await addUser.save();
      res.json({ message: "User registered" });
    } 
    catch (err) {
      console.error("Register error:", err);
      res
        .status(500)
        .json({ error: "Something went wrong during registration" });
    }
   
})

//login route
router.post("/login",async(req,res)=>{
  const {username,password}=req.body;
  const user=await User.findOne({username})
  if(!user)
  {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const isMatch=await bcrypt.compare(password,user.password)
  if(!isMatch)
  {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  req.session.user={
    id:user._id,
    role:user.role,
    username:user.username
  }

  req.session.userId = user._id;

  res.json({ message: "Login successful", user: req.session.user });
})

//logout
router.post("/logout",(req,res)=>{
  req.session.destroy((err)=>{
    if(err)
    {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid")
    res.json({ message: "Logout successful" });
  })
})

//for profile
router.get("/profile",(req,res)=>{
  if(!req.session.user)
  {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  const userId = req.session.user.id;

  User.findById(userId)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ user });
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
})

module.exports = router;