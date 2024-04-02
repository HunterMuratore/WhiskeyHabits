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

// Get a single user as well as their whiskey collection and userWhiskeys
export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      _id
      email
      username
      userCollection {
        whiskeyId
        userRating
        userNotes {
          nose
          taste
          finish
          overall
        }
      }
      userWhiskeys {
        _id
        name
        type
        image
        rating
        distiller
        abv
        review {
          nose
          taste
          finish
          overall
        }
      }
    }
  }
`;

// Get whiskey based off search/filter criteria
export const GET_WHISKEYS = gql`
  query GetWhiskeys($search: String, $page: Int!, $perPage: Int!, $sortByName: String, $sortByScore: String, $selectedType: String, $selectedDistiller: String ) {
    whiskeys(search: $search, page: $page, perPage: $perPage, sortByName: $sortByName, sortByScore: $sortByScore, selectedType: $selectedType, selectedDistiller: $selectedDistiller) {
      whiskeys {
        _id
        name
        image
        type
        rating
        link
        stats {
          distiller
          abv
        }
      }
      count
    }
  }
`

// Get top 5 whiskeys based off search
export const GET_WHISKEYS_DEBOUNCED = gql`
  query GetWhiskeysDebounced($search: String) {
    whiskeysDebounced(search: $search) {
      whiskeys
    }
  }
`

// Get single whiskey by id
export const GET_SINGLE_WHISKEY = gql`
  query GetWhiskeyById($whiskeyId: ID!) {
    getWhiskeyById(whiskeyId: $whiskeyId) {
      _id
      name
      image
      type
      rating
      link
      stats {
        distiller
        bottler
        abv
        age
        price
      }
      houseReviews {
        intro
        nose
        taste
        finish
        overall
        score
      }
    }
  }
`

// Get user collection whiskeys
export const GET_USER_COLLECTION_WHISKEYS = gql`
  query GetUserCollectionWhiskeys($userId: ID!) {
    getUserCollectionWhiskeys(userId: $userId) {
      _id
      userRating
      userNotes {
        nose
        taste
        finish
        overall
      }
      whiskey {
        _id
        name
        image
        type
        link
        stats {
          distiller
          bottler
          abv
          age
          price
        }
      }
    }
  }
`

// Get user wishlist whiskeys
export const GET_USER_WISHLIST_WHISKEYS = gql`
  query GetUserWishlistWhiskeys($userId: ID!) {
    getUserWishlistWhiskeys(userId: $userId) {
      whiskey {
        _id
        name
        image
        type
        rating
        link
        stats {
          distiller
          bottler
          abv
          age
          price
        }
        houseReviews {
          intro
          nose
          taste
          finish
          overall
          score
        }
      }
    }
  }
`