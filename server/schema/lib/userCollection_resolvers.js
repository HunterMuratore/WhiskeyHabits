const { User } = require('../../models');

const mongoose = require('mongoose');

const userCollectionResolvers = {
    Query: {

    },

    Mutation: {
        // Add a whiskey to a user's collection
        async addToCollection(_, { userId, whiskeyId, userRating, userNotes }) {
            try {
                // Find the user by userId
                const user = await User.findById(userId);

                if (!user) {
                    throw new Error('User not found');
                }

                // Check if the whiskey is already in the user's collection
                const existingEntry = user.userCollection.find(entry => entry.whiskeyId.toString() === whiskeyId);

                if (existingEntry) {
                    throw new Error('Whiskey already exists in your collection');
                }

                // Create a new userCollection object
                const collectionEntry = {
                    whiskeyId,
                    userRating,
                    userNotes
                };

                // Push the new collectionEntry to the user's userCollection array
                user.userCollection.push(collectionEntry);

                // Save the user document
                await user.save();

                return collectionEntry;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        // Update a whiskey in a user's collection
        async updateReview(_, { userId, whiskeyId, userRating, userNotes }) {
            try {
                // Find the user by userId
                const user = await User.findById(userId);

                if (!user) {
                    throw new Error('User not found');
                }

                // Find the userCollection object within the user's userCollection array by whiskeyId
                const collectionEntry = user.userCollection.find(entry => entry.whiskeyId === whiskeyId);

                if (!collectionEntry) {
                    throw new Error('Whiskey not found in collection');
                }

                // Update rating and notes if provided
                if (userRating !== undefined) {
                    collectionEntry.userRating = userRating;
                }

                if (userNotes !== undefined) {
                    collectionEntry.userNotes = userNotes;
                }

                // Save the user document
                await user.save();

                return collectionEntry;
            } catch (err) {
                throw new Error(err.message);
            }
        },
        // Remove a whiskey from a user's collection
        async removeFromCollection(_, { userId, whiskeyId }) {
            try {
                // Find the user by userId
                const user = await User.findById(userId);

                if (!user) {
                    throw new Error('User not found');
                }

                // Find the index of the userCollection object within the user's userCollection array by whiskeyId
                const index = user.userCollection.findIndex(entry => entry.whiskeyId === whiskeyId);

                if (index === -1) {
                    throw new Error('Whiskey not found in collection');
                }

                // Remove the userCollection object from the user's userCollection array
                const removedEntry = user.userCollection.splice(index, 1)[0];

                // Save the user document
                await user.save();

                return removedEntry;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};

module.exports = userCollectionResolvers;
