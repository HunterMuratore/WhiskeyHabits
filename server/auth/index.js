const { sign, verify } = require('jsonwebtoken');

// Function to create a JWT token for a user
async function createToken(user_id) {
    try {
        // Sign the user ID to create a JWT token
        const token = await sign({ user_id }, process.env.JWT_SECRET);

        // Return the generated token
        return token;

    } catch (err) {
        console.log('JWT create error', err.message);
    }
}

// Function to authenticate a user based on the provided token
async function authenticate({ req, res }) {
    const token = req.cookies.token;

    if (!token) return { res };

    try {
        // Verify the token's validity and extract user ID
        const data = await verify(token, process.env.JWT_SECRET, {
            maxAge: '2hr' // Set the maximum age for token validity
        });

        // Retrieve the user information from the database using the user ID
        const user = await User.findById(data.user_id);

        // Return user information and the response object
        return { user, res };

    } catch (err) {
        return { res };
    }
}

module.exports = { createToken, authenticate };