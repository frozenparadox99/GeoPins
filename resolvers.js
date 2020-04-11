const user = {
  _id: "1",
  name: "goku",
  email: "goke@gmail.com",
  picture: "https://cloudinary.com/asdf",
};

module.exports = {
  Query: {
    me: () => user,
  },
};
