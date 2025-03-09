import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import { RouterProvider } from 'react-router-dom'
import { router } from './Router/Router';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { ENDPOINT_GRAPHQL } from './ImportBackend/Config/emDesenvolvimento';

import { setContext } from '@apollo/client/link/context';

import './Config/cssGlobal.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const httpLink = createHttpLink( {
  uri: ENDPOINT_GRAPHQL,
} );

const getToken = () => {
  const token = localStorage.getItem( 'token' );
  return token
}

const authLink = setContext( ( _, { headers } ) => {
  return {
    headers: {
      ...headers,
      authorization: getToken() ? `Bearer ${getToken()}` : "",
    }
  }
} );

const client = new ApolloClient( {
  link: authLink.concat( httpLink ),
  cache: new InMemoryCache( { addTypename: false, } ),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache' //,
      // errorPolicy: 'all',
    },
    mutate: {
      fetchPolicy: 'no-cache' //,
      // errorPolicy: 'all',
    }
  }
} );

const root = ReactDOM.createRoot(
  document.getElementById( 'root' ) as HTMLElement
);

// console.log( 'ENDPOINT_GRAPHQL', ENDPOINT_GRAPHQL )

root.render(
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
