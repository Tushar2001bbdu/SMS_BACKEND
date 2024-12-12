let { ApolloServer } = require('@apollo/server')
let { startStandaloneServer } = require('@apollo/server/standalone')


const startServer = async () => {
    const typeDefs = require('../graphql/schema')
    const resolvers = require('../graphql/resolvers')
    const server = new ApolloServer({
        typeDefs,
        resolvers
    })
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3004 },
    })

    console.log(`Server is running at ${url}`);
};

module.exports = startServer;


