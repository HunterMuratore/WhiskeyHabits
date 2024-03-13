const gql = String.raw;

const typeDefs = gql`
    type User {
        _id: ID
        email: String
        username: String
        createdAt: String
        updatedAt: String
        userCollection: [UserCollection]
    }

    type Whiskey {
        _id: ID
        name: String
        image: String
        type: String
        rating: Int
        link: String
        stats: WhiskeyStats
        houseReviews: WhiskeyHouseReviews
    }

    type WhiskeyStats {
        distiller: String
        bottler: String
        abv: String
        age: String
        price: String
    }

    type WhiskeyHouseReviews {
        intro: String
        nose: [String]
        taste: [String]
        finish: [String]
        overall: String
        score: String
    }

    type UserCollection {
        userId: ID
        whiskeyId: ID
        userRating: Float
        userNotes: WhiskeyNotes
    }

    type UserCollectionWhiskeys {
        userNotes: WhiskeyNotes
        whiskeyId: ID
        userRating: Float
        _id: ID
        whiskey: Whiskey
    }

    type WhiskeyNotes {
        nose: String
        taste: String
        finish: String
        overall: String
    }

    type WhiskeysResult {
        whiskeys: [Whiskey]
        count: Int
    }

    type Query {
        authenticate: User
        getUserById(userId: ID!): User
        whiskeys(search: String, page: Int!, perPage: Int!, sortByName: String, sortByScore: String, selectedType: String, selectedDistiller: String): WhiskeysResult
        getWhiskeyById(whiskeyId: ID!): Whiskey
        getUserCollectionWhiskeys(userId: ID!): [UserCollectionWhiskeys]
    }

    type Mutation {
        register(email: String!, username: String!, password: String!): User
        login(identifier: String!, password: String!): User
        logout: String
        addToCollection(userId: ID!, whiskeyId: ID!, userRating: Float, userNotes: WhiskeyNotesInput): UserCollection
        updateReview(userId: ID!, whiskeyId: ID!, userRating: Float, userNotes: WhiskeyNotesInput): UserCollection
        removeFromCollection(userId: ID!, whiskeyId: ID!): UserCollection
    }

    input WhiskeyNotesInput {
        nose: String
        taste: String
        finish: String
        overall: String
    }
`;

module.exports = typeDefs;
