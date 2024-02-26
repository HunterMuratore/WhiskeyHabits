const { Whiskey } = require("../../models")

const whiskey_resolvers = {
    Query: {
        // Get all whiskeys or filter by search query
        async whiskeys (_, { search }) {
            try {
                let whiskeys;
                if (search) {
                    // If search query is provided, perform text search on name, distiller, country, region, or type fields
                    whiskeys = await Whiskey.find({
                        $or: [
                            // Case-insensitive searches
                            { name: { $regex: new RegExp(search, 'i') } },
                            { distiller: { $regex: new RegExp(search, 'i') } },
                            { country: { $regex: new RegExp(search, 'i') } },
                            { region: { $regex: new RegExp(search, 'i') } },
                            { type: { $regex: new RegExp(search, 'i') } },
                        ],
                    });
                } else {
                    // If no search query is provided, get all whiskeys
                    whiskeys = await Whiskey.find();
                }
                return whiskeys;
            } catch (err) {
                throw new Error('Failed to get whiskeys');
            }
        },
        // Get single whiskey by id
        async getWhiskeyByID(_, { id }) {
            try {
                const whiskey = await Whiskey.findById(id);
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