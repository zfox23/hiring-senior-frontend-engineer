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
import { launchpadAll, setPageTheme } from '../helpers/helperFunctions';
import useBodyClass from '../hooks/useBodyClass';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";
import { SummaryCards } from '../components/SummaryCards';
import { PayloadCountByNationalityCard } from '../components/PayloadCountByNationality';
import { TopFiveMissionsCard } from '../components/TopFiveMissions';
import { LaunchDataCard } from '../components/LaunchDataTable';

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
    const [selectedLaunchpad, setSelectedLaunchpad] = useState(launchpadAll);

    useBodyClass(['min-w-screen', 'min-h-screen', 'transition-colors', 'bg-gray-light', 'dark:bg-dark-gray-medium'])

    useEffect(() => {
        setPageTheme();
    });

    return (
        <ApolloProvider client={client}>
            <div className='container mx-auto p-8'>
                <Header selectedLaunchpad={selectedLaunchpad} setSelectedLaunchpad={setSelectedLaunchpad} />
                <main className='flex flex-col gap-4'>
                    <SummaryCards selectedLaunchpad={selectedLaunchpad} />
                    <div className='flex flex-wrap gap-4 justify-center items-stretch'>
                        <PayloadCountByNationalityCard selectedLaunchpad={selectedLaunchpad} />
                        <TopFiveMissionsCard selectedLaunchpad={selectedLaunchpad} />
                    </div>
                    <LaunchDataCard selectedLaunchpad={selectedLaunchpad} />
                </main>
            </div>
        </ApolloProvider>
    )
}

export default Home
