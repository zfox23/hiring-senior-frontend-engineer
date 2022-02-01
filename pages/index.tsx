import type { NextPage, GetServerSideProps } from 'next';
import "@fontsource/metropolis/200.css";
import "@fontsource/metropolis/300.css";
import "@fontsource/metropolis/400.css";
import "@fontsource/metropolis/500.css";
import "@fontsource/metropolis/700.css";
// import Head from 'next/head'
// import Image from 'next/image'
//import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { setPageTheme } from '../helpers/helperFunctions';
import useBodyClass from '../hooks/useBodyClass';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
});

export const getServerSideProps: GetServerSideProps = async (context) => {


    return {
        props: {
            results: [1, 2, 3],
        },
    };
}

const Home: NextPage = () => {
    const [launchSite, setLaunchSite] = useState(null);

    useBodyClass(['min-w-screen', 'min-h-screen', 'transition-colors', 'bg-gray-light', 'dark:bg-dark-gray-dark'])

    useEffect(() => {
        setPageTheme();
    });

    return (
        <ApolloProvider client={client}>
            <div className='container mx-auto p-8'>
                <Header />
                <main></main>
            </div>
        </ApolloProvider>
    )
}

export default Home
