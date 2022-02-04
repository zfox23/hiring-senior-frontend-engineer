import type { NextPage, GetServerSideProps } from 'next';
import "@fontsource/metropolis/200.css";
import "@fontsource/metropolis/300.css";
import "@fontsource/metropolis/400.css";
import "@fontsource/metropolis/500.css";
import "@fontsource/metropolis/700.css";
import React, { useEffect, useRef, useState } from 'react';
import { MainIndexHeader } from '../components/MainIndexHeader';
import { launchpadAll, setPageTheme } from '../helpers/helperFunctions';
import useBodyClass from '../hooks/useBodyClass';
import { SummaryCards } from '../components/SummaryCards';
import { PayloadCountByNationalityCard } from '../components/PayloadCountByNationality';
import { TopFiveMissionsCard } from '../components/TopFiveMissions';
import { LaunchDataCard } from '../components/LaunchDataTable';

const Home: NextPage = () => {
    const [selectedLaunchpad, setSelectedLaunchpad] = useState(launchpadAll);
    const [fullscreenLaunchData, setFullscreenLaunchData] = useState(false);
    const topContainer = useRef<HTMLDivElement>(null);

    useBodyClass(['min-w-screen', 'min-h-screen', 'transition-colors', 'bg-gray-light', 'dark:bg-dark-gray-medium'])

    useEffect(() => {
        setPageTheme();
    });

    const toggleFullscreenLaunchData = () => {
        setFullscreenLaunchData(!fullscreenLaunchData);
    }

    return (
        <div className={`container mx-auto py-6 px-1 ${fullscreenLaunchData ? "h-screen flex flex-col overflow-y-hidden" : ""}`}>
            <MainIndexHeader selectedLaunchpad={selectedLaunchpad} setSelectedLaunchpad={setSelectedLaunchpad} />
            <main className={`flex flex-col gap-4 ${fullscreenLaunchData ? "h-full" : ""}`}>
                <div id='topContainer' className={`flex flex-col box-border gap-4 transition-all duration-1000 ${fullscreenLaunchData ? "opacity-0 max-h-0 -z-10" : "opacity-100 max-h-[900px]"}`}>
                    <SummaryCards selectedLaunchpad={selectedLaunchpad} />
                    <div className='flex flex-wrap gap-4 justify-center items-stretch'>
                        <PayloadCountByNationalityCard selectedLaunchpad={selectedLaunchpad} />
                        <TopFiveMissionsCard selectedLaunchpad={selectedLaunchpad} />
                    </div>
                </div>
                <LaunchDataCard selectedLaunchpad={selectedLaunchpad} fullscreenLaunchData={fullscreenLaunchData} toggleFullscreenLaunchData={toggleFullscreenLaunchData} />
            </main>
        </div>
    )
}

export default Home
