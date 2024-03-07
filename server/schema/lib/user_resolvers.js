const { User } = require('../../models');

const { createToken } = require('../../auth');

// Define resolvers for user-related queries and mutations
const user_resolvers = {
    Query: {
        // Resolver to authenticate and return the current user
        authenticate(_, __, context) {
            return context.user;
        },

        // Resolver to get user information by user ID
        async getUserById(_, { userId }) {
            try {
                const user = await User.findById(userId);
                return user;

            } catch (err) {
                throw new Error(err.message);
            }
        }
    },

    Mutation: {
        // Resolver to register a new user
        async register(_, args, context) {
            try {
                const user = await User.create(args);

                // Create and set authentication token in the cookie
                const token = await createToken(user._id);
                context.res.cookie('token', token, {
                    maxAge: 120 * 60 * 1000, // Set the token's expiration time
                    httpOnly: true
                });

                return user;

            } catch (err) {
                let message;

                // Handle duplicate key error (email already in use)
                if (err.code === 11000) {
                    message = 'That email address is already in use';
                } else {
                    message = err.message;
                }

                throw new Error(message);
            }
        },

        // Resolver to handle user login
        async login(_, args, context) {
            const { identifier, password } = args;

            try {
                // Find the user by email or username
                const user = await User.findOne({
                    $or: [{ email: identifier }, { username: identifier }],
                });

                if (!user) throw new Error('User not found');

                // Validate the provided password
                const pass_is_valid = await user.validatePass(password);

                if (!pass_is_valid) throw new Error('Password invalid');

                // Create and set authentication token in the cookie
                const token = await createToken(user._id);
                context.res.cookie('token', token, {
                    maxAge: 120 * 60 * 1000,
                    httpOnly: true,
                    secure: process.env.PORT ? true : false
                });

                return user;

            } catch (err) {
                throw new Error(err.message);
            }
        },

        // Resolver to handle user logout
        logout(_, __, context) {
            // Clear the authentication token from the cookie
            context.res.clearCookie('token');

            return 'User logged out successfully';
        },
    }
}

module.exports = user_resolvers;