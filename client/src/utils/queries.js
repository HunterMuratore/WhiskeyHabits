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
      userCollections {
        _id
        userId
        whiskeyId {
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
        }
        rating
        userNotes {
          nose
          taste
          finish
        }
      }
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
