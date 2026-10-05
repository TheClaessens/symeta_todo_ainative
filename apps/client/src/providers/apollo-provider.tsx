import React, { type FC } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Constants } from '@repo/shared';

import { env } from '@/env';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: ({ operationName, query }) => {
    const def = query.definitions
      .map((definition) =>
        'operation' in definition ? definition.operation : ''
      )
      .join('');
    return `${env.VITE_BACKEND_URL}/graphql?t=${def}&o=${operationName}`;
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(Constants.ACCESS_TOKEN);
  if (!token) {
    return headers;
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  uri: `${env.VITE_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
  link: from([errorLink, authLink, httpLink]),
});

interface ApolloProviderProps {
  children: React.ReactNode;
}
const _ApolloProvider: FC<ApolloProviderProps> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default _ApolloProvider;
