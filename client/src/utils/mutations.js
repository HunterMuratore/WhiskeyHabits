import { gql } from '@apollo/client'

export const REGISTER = gql`
  mutation Register($email: String!, $username: String!, $password: String!) {
    register(email: $email, username: $username, password: $password) {
      _id
      email
      username
    }
  }
`

export const LOGIN = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      _id
      email
      username
    }
  }
`

// Add a whiskey to a user's collection
export const ADD_TO_COLLECTION = gql`
mutation AddToCollection($userId: ID!, $whiskeyId: ID!, $rating: Float, $notes: WhiskeyNotesInput) {
  addToCollection(userId: $userId, whiskeyId: $whiskeyId, rating: $rating, notes: $notes) {
    _id
    userId
    whiskeyId
    rating
    notes {
      nose
      taste
      finish
    }
  }
}
`

// Update a whiskey in a user's collection
export const UPDATE_REVIEW = gql`
mutation UpdateReview($userId: ID!, $whiskeyId: ID!, $rating: Float, $notes: WhiskeyNotesInput) {
  updateReview(userId: $userId, whiskeyId: $whiskeyId, rating: $rating, notes: $notes) {
    _id
    userId
    whiskeyId
    rating
    notes {
      nose
      taste
      finish
    }
  }
}
`

// Remove a whiskey from a user's collection
export const REMOVE_FROM_COLLECTION = gql`
mutation RemoveFromCollection($userId: ID!, $whiskeyId: ID!) {
  removeFromCollection(userId: $userId, whiskeyId: $whiskeyId) {
    _id
    userId
    whiskeyId
    rating
    notes {
      nose
      taste
      finish
    }
  }
}
`