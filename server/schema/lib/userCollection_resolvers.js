const { UserCollection } = require('../../models');

const userCollectionResolvers = {
    Query: {

    },

    Mutation: {
        // Add a whiskey to a user's collection
        async addToCollection(_, { userId, whiskeyId, rating, notes }) {
            try {
                const existingEntry = await UserCollection.findOne({ userId, whiskeyId });

                if (existingEntry) {
                    throw new Error('Whiskey already exists in your collection');
                }

                const collectionEntry = new UserCollection({
                    userId,
                    whiskeyId,
                    rating,
                    notes,
                });

                await collectionEntry.save();

                return collectionEntry;
            } catch (err) {
                throw new Error('Failed to add whiskey to collection');
            }
        },
        // Update a whiskey in a user's collection
        async updateReview(_, { userId, whiskeyId, rating, notes }) {
            try {
                let collectionEntry = await UserCollection.findOne({ userId, whiskeyId });

                if (!collectionEntry) {
                    throw new Error('Whiskey not found in collection');
                }

                // Update rating and notes if provided
                if (rating !== undefined) {
                    collectionEntry.rating = rating;
                }

                if (notes !== undefined) {
                    collectionEntry.notes = notes;
                }

                await collectionEntry.save();

                return collectionEntry;
            } catch (err) {
                throw new Error('Failed to update review');
            }
        },
        // Remove a whiskey from a user's collection
        async removeFromCollection(_, { userId, whiskeyId }) {
            try {
                const collectionEntry = await UserCollection.findOneAndDelete({ userId, whiskeyId });

                if (!collectionEntry) {
                    throw new Error('Whiskey not found in collection');
                }
                
                return collectionEntry;
            } catch (err) {
                throw new Error('Failed to remove whiskey from collection');
            }
        },
    },
};

module.exports = userCollectionResolvers;
