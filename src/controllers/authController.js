const authService = require('../services/authServices');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(result.status).json(result.data);
};

exports.register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(result.status).json(result.data);
};
