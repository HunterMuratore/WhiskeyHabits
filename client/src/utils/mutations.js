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
      highscores {
        score
        languageName
      }
    }
  }
`