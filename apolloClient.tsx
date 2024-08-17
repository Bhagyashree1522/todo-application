"use client";

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client"
import { ReactNode } from "react"


export const Provider = ({children}: {children: ReactNode}) => {
    const client = new  ApolloClient({
        // uri: 'http://localhost:3000/graphql',
        link: new HttpLink({
            uri: 'http://localhost:3000/graphql',
        }),
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};
