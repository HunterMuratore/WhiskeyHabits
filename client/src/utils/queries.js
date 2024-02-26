import { gql } from '@apollo/client'

export const AUTHENTICATE = gql`
  query {
    authenticate {
      _id
      email
      username
    }
  }
`

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      _id
      email
      username
    }
  }
`

// Get whiskey based off search or get all whiskeys if no search
export const GET_WHISKEYS = gql`
  query GetWhiskeys($search: String) {
    whiskeys(search: $search) {
      _id
      name
      img
      type
      distiller
      country
      region
      bottler
      abv
      age
      price
      notes {
        nose
        taste
        finish
      }
      score
    }
  }
`

// Get a specific user's whiskey collection
export const GET_USER_COLLECTION = gql`
  query GetUserCollection($userId: ID!) {
    getUserCollection(userId: $userId) {
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