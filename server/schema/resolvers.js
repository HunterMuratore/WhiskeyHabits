const user_resolvers = require('./lib/user_resolvers');
const whiskey_resolvers = require('./lib/whiskey_resolvers');
const userCollection_resolvers = require('./lib/userCollection_resolvers');

const resolvers = {
    Query: {
        ...user_resolvers.Query,
        ...whiskey_resolvers.Query,
        ...userCollection_resolvers.Query,
    },

    Mutation: {
        ...user_resolvers.Mutation,
        ...whiskey_resolvers.Mutation,
        ...userCollection_resolvers.Mutation,
    }
}

module.exports = resolvers;
