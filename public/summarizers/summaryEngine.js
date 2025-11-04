const books = require('./books');
const movies = require('./movies');
const phones = require('./phones');
const generic = require('./generic');

module.exports = async (topic, type) => {
  if (type === 'book') return await books(topic);
  if (type === 'movie') return await movies(topic);
  if (type === 'phone') return await phones(topic);
  return await generic(topic);
};
