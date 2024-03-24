const user_resolvers = require('./lib/user_resolvers');
const whiskey_resolvers = require('./lib/whiskey_resolvers');
const userCollection_resolvers = require('./lib/userCollection_resolvers');
const userWishlist_resolvers = require('./lib/userWishlist_resolvers');
const userWhiskeys_resolvers = require('./lib/userWhiskeys_resolvers');

const resolvers = {
    Query: {
        ...user_resolvers.Query,
        ...whiskey_resolvers.Query,
        ...userCollection_resolvers.Query,
        ...userWishlist_resolvers.Query,
        ...userWhiskeys_resolvers.Query,
    },

    Mutation: {
        ...user_resolvers.Mutation,
        ...whiskey_resolvers.Mutation,
        ...userCollection_resolvers.Mutation,
        ...userWishlist_resolvers.Mutation,
        ...userWhiskeys_resolvers.Mutation,
    }
}

module.exports = resolvers;
