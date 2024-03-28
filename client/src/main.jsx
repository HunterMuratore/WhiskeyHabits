import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './index.scss'

import { StoreProvider } from './store.jsx'

import { BrowserRouter as Router } from 'react-router-dom'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { onError } from '@apollo/client/link/error'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

const httpLink = new createUploadLink({
  uri: '/graphql',
  headers: {
    'Apollo-Require-Preflight': 'true',
  }
})

const client = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <StoreProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </StoreProvider>
    </Router>
  </React.StrictMode>,
)
