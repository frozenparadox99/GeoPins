const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const { findOrCreateUser } = require("./controllers/userController");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected..."))
  .catch((err) => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        //find user or create and then return data
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error("Unable to authenticate user with token", authToken);
    }

    return { currentUser };
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
