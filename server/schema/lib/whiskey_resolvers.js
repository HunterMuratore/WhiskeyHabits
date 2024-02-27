const { Whiskey } = require("../../models")

const whiskey_resolvers = {
    Query: {
        // Get all whiskeys or filter by search query
        async whiskeys(_, { search, page, perPage }) {
            try {
                let query = Whiskey.find();
                
                // Apply search filter if provided
                if (search) {
                    query = query.find({
                        $or: [
                            // Case-insensitive searches
                            { name: { $regex: new RegExp(search, 'i') } },
                            { distiller: { $regex: new RegExp(search, 'i') } },
                            { country: { $regex: new RegExp(search, 'i') } },
                            { region: { $regex: new RegExp(search, 'i') } },
                            { type: { $regex: new RegExp(search, 'i') } },
                        ],
                    });
                }
                
                // Calculate skip and limit for pagination
                const skip = (page - 1) * perPage;
                const limit = perPage;
                
                // Apply pagination
                query = query.skip(skip).limit(limit);
                
                // Count the total number of whiskeys
                const count = search ? await Whiskey.countDocuments(query._conditions) : await Whiskey.countDocuments();
                
                const whiskeys = await query.exec();
                
                return { whiskeys, count };
            } catch (err) {
                throw new Error('Failed to get whiskeys');
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
                throw new Error('Failed to get whiskey');
            }
        },
    },
    Mutation: {

    }
}

module.exports = whiskey_resolvers;