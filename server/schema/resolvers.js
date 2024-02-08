const user_resolvers = require('./lib/user_resolvers');

const resolvers = {
    Query: {
        ...user_resolvers.Query,
    },

    Mutation: {
        ...user_resolvers.Mutation,
    }
}

module.exports = resolvers;
