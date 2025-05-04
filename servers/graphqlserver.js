const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');

const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');

const app = express();

async function startGraphQLServer(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', express.json(), expressMiddleware(server)); // only one required middleware

  
}

module.exports=startGraphQLServer;
