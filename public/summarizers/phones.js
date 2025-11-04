const gemini = require('./generic');
module.exports = async (title) => {
  return await gemini(title, 'phone');
};
