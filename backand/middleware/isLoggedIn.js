module.exports = (req, res, next) => {
  if (req.session?.user || req.session?.userId) return next();
  res.status(401).json({ error: "Unauthorized" });
};
