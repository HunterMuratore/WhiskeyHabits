const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

// Create an Express application
const app = express();

require('dotenv').config();

// Set up environment variables and constants
const PORT = process.env.PORT || 3001;
const is_prod = process.env.NODE_ENV === 'production';

// Establish a connection to the database
const db = require('./config/connection');

// Import authentication function and GraphQL schema
const { authenticate } = require('./auth');
const { typeDefs, resolvers } = require('./schema');

// Create an Apollo Server instance with the specified type definitions and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Function to start the server
async function startServer() {
    // Start the Apollo Server
    await server.start();

    // Set up middleware for parsing JSON requests
    app.use(express.json());

    // Serve static files from the client's build folder in production
    if (is_prod) {
        app.use(express.static(path.join(__dirname, '../client/dist')))
    }

    // Use cookie parser middleware to handle cookies
    app.use(cookieParser());

    // Serve static files from the 'public' directory
    app.use(express.static('public'));

    // Configure GraphQL authentication middleware
    app.use('/graphql', expressMiddleware(server, {
        context: authenticate
    }));

    // In production, serve the client's build folder for all routes
    if (is_prod) {
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }

    // Once the database connection is open, start the server
    db.once('open', () => {
        console.log('Database connected');

        app.listen(PORT, () => {
            console.log('Server started on port', PORT);
            console.log('GraphQL ready at /graphql');
        });
    });
}

// Call the function to start the server
startServer();