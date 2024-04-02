const { Whiskey, User } = require("../../models");

const whiskey_resolvers = {
    Query: {
        // Get all whiskeys or filter by search query
        async whiskeys(_, { search, page, perPage, sortByName, sortByScore, selectedType, selectedDistiller }) {
            try {
                let query = Whiskey.find();

                // Apply search filter if provided
                if (search) {
                    query = query.find({
                        $or: [
                            // Case-insensitive search
                            { name: { $regex: new RegExp(search, 'i') } },
                        ],
                    });
                }

                // Apply type filter
                if (selectedType) {
                    query = query.where('type', new RegExp(selectedType, 'i'));
                }

                // Apply distiller filter
                if (selectedDistiller) {
                    query = query.where('stats.distiller', new RegExp(selectedDistiller, 'i'));
                }

                // Apply sorting options with case insensitivity
                if (sortByName === 'asc') {
                    query = query.collation({ locale: 'en', strength: 2 }).sort({ name: 1 }); // Sort names alphabetically ascending 
                } else if (sortByName === 'desc') {
                    query = query.collation({ locale: 'en', strength: 2 }).sort({ name: -1 }); // Sort names alphabetically descending
                } else if (!sortByName && !sortByScore) {
                    query = query.collation({ locale: 'en', strength: 2 }).sort({ name: 1 }); // Sort names alphabetically ascending by default
                }

                if (sortByScore === 'highToLow') {
                    query = query.sort({
                        rating: -1, // Sort scores from high to low
                        _id: -1 // Add secondary sort by _id to ensure consistent sorting
                    });
                } else if (sortByScore === 'lowToHigh') {
                    query = query.sort({
                        rating: 1, // Sort scores from low to high
                        _id: -1 // Add secondary sort by _id to ensure consistent sorting
                    });
                }

                // Calculate skip and limit for pagination
                const skip = (page - 1) * perPage;
                const limit = perPage;

                // Apply pagination
                query = query.skip(skip).limit(limit);

                // Count the total number of whiskeys
                const count = (search || selectedDistiller || selectedType) ? await Whiskey.countDocuments(query._conditions) : await Whiskey.countDocuments();

                const whiskeys = await query.exec();

                return { whiskeys, count };
            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Get top 5 whiskeys of user's search
        async whiskeysDebounced(_, { search }) {
            try {
                let query = Whiskey.find();
        
                // Apply search filter
                if (search) {
                    query = query.find({
                        $or: [
                            // Case-insensitive search
                            { name: { $regex: new RegExp(search, 'i') } },
                        ],
                    });
                }
        
                // Sort by name alphabetically ascending
                query = query.collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
        
                // Limit to top 5 results
                query = query.limit(5);
        
                // Project only the name field
                query = query.select('name');

                // Execute the query
                const whiskeys = await query.exec();

                // Map the whiskeys into an array to return to the client
                const whiskeyArray = whiskeys.map(whiskey => whiskey.name)
                
                return { whiskeys: whiskeyArray };
            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Get single whiskey by id
        async getWhiskeyById(_, { whiskeyId }) {
            try {
                const whiskey = await Whiskey.findById(whiskeyId);

                if (!whiskey) {
                    throw new Error('Whiskey not found');
                }

                return whiskey;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Get the whiskeys in a user's collection
        async getUserCollectionWhiskeys(_, { userId }) {
            try {
                // Find the user by userId
                const user = await User.findById(userId);

                if (!user) {
                    throw new Error('User not found');
                }

                // Retrieve user's whiskey collection
                const userWhiskeyIds = user.userCollection.map(item => item.whiskeyId);

                // Fetch whiskeys from the database using the IDs
                const userWhiskeys = await Whiskey.find({ _id: { $in: userWhiskeyIds } });

                // Combine user collection and whiskey data into a new array
                const combinedData = user.userCollection.map(collectionItem => {
                    const whiskey = userWhiskeys.find(whiskey => whiskey._id.equals(collectionItem.whiskeyId));
                    return {
                        ...collectionItem.toObject(),
                        whiskey: whiskey.toObject()
                    }
                });

                return combinedData;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Get the whiskeys in a user's wishlist
        async getUserWishlistWhiskeys(_, { userId }) {
            try {
                // Find the user by userId
                const user = await User.findById(userId);

                if (!user) {
                    throw new Error('User not found');
                }

                // Retrieve user's whiskey wishlist
                const userWhiskeyIds = user.userWishlist.map(item => item.whiskeyId);

                // Fetch whiskeys from the database using the IDs
                const userWhiskeys = await Whiskey.find({ _id: { $in: userWhiskeyIds } });

                // Combine user wishlist and whiskey data into a new array
                const combinedData = user.userWishlist.map(wishlistItem => {
                    const whiskey = userWhiskeys.find(whiskey => whiskey._id.equals(wishlistItem.whiskeyId));
                    return {
                        ...wishlistItem.toObject(),
                        whiskey: whiskey.toObject()
                    }
                });

                return combinedData;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
    Mutation: {

    }
}

module.exports = whiskey_resolvers;