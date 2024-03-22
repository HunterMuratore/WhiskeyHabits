const { User } = require('../../models');
const { authenticate } = require('../../auth')

const userWishlistResolvers = {
    Query: {

    },

    Mutation: {
        // Add a whiskey to a user's wishlist
        async addToWishlist(_, { userId, whiskeyId }, context) {
            try {
                // Extract user information from the context
                const user = context.user;

                if (!user) {
                    throw new Error('User not authenticated');
                }

                // Check if the authenticated user's ID matches the provided userId
                if (user._id.toString() !== userId) {
                    throw new Error('Unauthorized');
                }

                // Find the user by userId
                const targetUser = await User.findById(userId);

                if (!targetUser) {
                    throw new Error('User not found');
                }

                // Check if the whiskey is already in the user's wishlist
                const existingEntry = targetUser.userWishlist.find(entry => entry.whiskeyId.equals(whiskeyId));

                if (existingEntry) {
                    throw new Error('Whiskey already exists in your wishlist');
                }

                // Create a new userWishslist object
                const wishlistEntry = {
                    whiskeyId,
                };

                // Push the new wishlistEntry to the user's userWishlist array
                targetUser.userWishlist.push(wishlistEntry);

                // Save the user document
                await targetUser.save();

                return wishlistEntry;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        // Remove a whiskey from a user's wishlist
        async removeFromWishlist(_, { userId, whiskeyId }, context) {
            try {
                // Extract user information from the context
                const user = context.user;

                if (!user) {
                    throw new Error('User not authenticated');
                }

                // Check if the authenticated user's ID matches the provided userId
                if (user._id.toString() !== userId) {
                    throw new Error('Unauthorized');
                }

                // Find the user by userId
                const targetUser = await User.findById(userId);

                if (!targetUser) {
                    throw new Error('User not found');
                }

                // Find the index of the userWishlist object within the user's userWishlist array by whiskeyId
                const index = targetUser.userWishlist.findIndex(entry => entry.whiskeyId.equals(whiskeyId));

                if (index === -1) {
                    throw new Error('Whiskey not found in wishlist');
                }

                // Remove the userWishlist object from the user's userWishlist array
                const removedEntry = targetUser.userWishlist.splice(index, 1)[0];

                // Save the user document
                await targetUser.save();

                return removedEntry;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};

module.exports = userWishlistResolvers;
