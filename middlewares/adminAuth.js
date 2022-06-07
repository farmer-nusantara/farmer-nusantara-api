const adminAuthorization = (req, res, next) => {
  const { role } = req.user;
  console.log(role);
  if (role && role === "admin") return next();

  return res.status(400).json({ message: 'access denied, user not admin' });
}

module.exports = adminAuthorization;