const { User } = require('../../models');
const { authenticate } = require('../../auth');
const path = require('path');
const fs = require('fs');
const { v4 } = require('uuid');

const userWhiskeyResolvers = {
    Query: {

    },

    Mutation: {
        async addUserWhiskey(_, { userId, whiskeyInput }, context) {
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

                if (whiskeyInput.image) {
                    const { createReadStream, filename } = await whiskeyInput.image;

                    // Generate a unique filename for the uploaded image
                    const uniqueFilename = v4() + path.extname(filename);

                    // Define the path where the image will be saved
                    const filePath = path.join(__dirname, '../../public/user_whiskey_images', uniqueFilename);

                    // Create a writable stream to save the image
                    const fileStream = createReadStream().pipe(fs.createWriteStream(filePath));

                    // Wait for the file to finish uploading
                    await new Promise((resolve, reject) => {
                        fileStream.on('finish', resolve);
                        fileStream.on('error', reject);
                    });

                    // Set the image path in the whiskey input
                    whiskeyInput.image = filePath;
                }

                // Create a new userWhiskey object using the input
                const newUserWhiskey = {
                    ...whiskeyInput,
                };

                // Push the new userWhiskey object to the user's userWhiskeys array
                targetUser.userWhiskeys.push(newUserWhiskey);

                // Save the updated user document
                await targetUser.save();

                return newUserWhiskey;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Mutation to update a user-specific whiskey entry
        async updateUserWhiskey(_, { userId, whiskeyId, whiskeyInput }, context) {
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

                // Find the index of the whiskey entry in the user's userWhiskeys array
                const index = targetUser.userWhiskeys.findIndex(entry => entry._id.toString() === whiskeyId);

                if (index === -1) {
                    throw new Error('Whiskey entry not found');
                }

                // Check if a new image is being uploaded
                if (whiskeyInput.image) {
                    const { createReadStream, filename } = await whiskeyInput.image.file;

                    // Generate a unique filename for the uploaded image
                    const uniqueFilename = v4() + path.extname(filename);

                    // Define the path where the new image will be saved
                    const filePath = path.join(__dirname, '../../public/user_whiskey_images', uniqueFilename);

                    // Create a writable stream to save the new image
                    const fileStream = createReadStream().pipe(fs.createWriteStream(filePath));

                    // Wait for the file to finish uploading
                    await new Promise((resolve, reject) => {
                        fileStream.on('finish', resolve);
                        fileStream.on('error', reject);
                    });

                    // Delete the old image if it exists
                    if (targetUser.userWhiskeys[index].imagePath) {
                        fs.unlinkSync(targetUser.userWhiskeys[index].imagePath);
                    }

                    // Set the image path in the whiskey input
                    whiskeyInput.image = `/user_whiskey_images/${uniqueFilename}`;
                }

                // Update the whiskey entry with the provided whiskeyInput
                targetUser.userWhiskeys[index] = { ...whiskeyInput };

                // Save the updated user document
                await targetUser.save();

                return targetUser.userWhiskeys[index];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Mutation to delete a user-specific whiskey entry
        async removeUserWhiskey(_, { userId, whiskeyId }, context) {
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

                // Find the index of the whiskey entry in the user's userWhiskeys array
                const index = targetUser.userWhiskeys.findIndex(entry => entry._id.toString() === whiskeyId);

                if (index === -1) {
                    throw new Error('Whiskey entry not found');
                }

                // Remove the whiskey entry from the user's userWhiskeys array
                const deletedWhiskey = targetUser.userWhiskeys.splice(index, 1)[0];

                // Save the updated user document
                await targetUser.save();

                return deletedWhiskey;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};

module.exports = userWhiskeyResolvers;
