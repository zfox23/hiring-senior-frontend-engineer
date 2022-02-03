import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { FormEvent, useEffect, useState } from 'react';
import { launchesData, launchpad, missionsData, payloadsData } from '../helpers/helperFunctions';
import { LoadingSpinner } from './LoadingSpinner';
import { ArrowsExpandIcon, SearchIcon } from '@heroicons/react/outline';

const LAUNCH_DATA = gql`
    query GetLaunchData($selectedLaunchpadID: String, $searchedMissionName: String) {
        launches(find: {site_id: $selectedLaunchpadID, mission_name: $searchedMissionName}) {
            launch_site {
                site_id
                site_name
            }
            mission_id
            launch_date_unix
            launch_success
            mission_name
            rocket {
                rocket_name
                rocket {
                payload_weights {
                    kg
                }
            }
        }
    }
}
`;

const LaunchDataHeader = ({toggleFullscreenLaunchData}: {toggleFullscreenLaunchData: () => void}) => {
    return (
        <div className='flex items-center justify-between border-b-4 p-3 transition-colors border-gray-light dark:border-dark-gray-medium'>
            <h2 className='text-dark-purple dark:text-white transition-colors text-xl font-semibold'>SpaceX Launch Data</h2>
            <button
                onClick={toggleFullscreenLaunchData}>
                <ArrowsExpandIcon className='w-5 h-5 ml-2 mb-0.5 text-blue dark:text-white transition-colors' />
            </button>
        </div>
    )
}

interface launchData {
    name: string;
    timestampUnix: number;
    success: Boolean;
    rocketName: string;
    payloadMassKG: number;
    siteName: string;
    missionId: string;
}

export const LaunchDataCard = ({ selectedLaunchpad, fullscreenLaunchData, toggleFullscreenLaunchData }: { selectedLaunchpad: launchpad, fullscreenLaunchData: Boolean, toggleFullscreenLaunchData: () => void }) => {
    const [launchData, setLaunchData] = useState<launchData[]>();
    const [searchedMissionName, setSearchedMissionName] = useState<string>();

    const { loading, error, data } = useQuery(LAUNCH_DATA, {
        variables: {
            selectedLaunchpadID: selectedLaunchpad.id === "custom_all" ? null : selectedLaunchpad.id,
            searchedMissionName
        },
    });

    useEffect(() => {
        if (loading || error) {
            setLaunchData(undefined);

            if (error) {
                console.error(`Error in \`useQuery()\`:\n${error}`);
            }
            return;
        }

        if (!(data && data.launches && data.launches.length > 0)) {
            setLaunchData(undefined);
            return;
        }

        let tempLaunchData: launchData[] = [];
        data.launches.forEach((launchData: launchesData) => {
            if (!(launchData.mission_name && launchData.launch_date_unix && typeof launchData.launch_success === "boolean" && launchData.rocket && launchData.launch_site && launchData.launch_site.site_name && launchData.mission_id && launchData.mission_id.length > 0)) {
                return;
            }

            tempLaunchData.push({
                name: launchData.mission_name,
                timestampUnix: launchData.launch_date_unix,
                success: launchData.launch_success,
                rocketName: launchData.rocket?.rocket_name,
                payloadMassKG: launchData.rocket?.rocket.payload_weights.reduce((sum, a: any) => sum + a.kg, 0),
                siteName: launchData.launch_site.site_name,
                // Assume the first `mission_id` is the one we should use for display.
                missionId: launchData.mission_id[0]
            });
        });

        setLaunchData(tempLaunchData);
    }, [data]);

    return (
        <div className={`flex ${fullscreenLaunchData ? 'h-0' : ''} flex-col bg-white dark:bg-dark-gray-light transition-colors rounded-md shadow-md grow`}>
            <LaunchDataHeader toggleFullscreenLaunchData={toggleFullscreenLaunchData} />
            <form onSubmit={(e: any) => {
                e.preventDefault();
                const userInput = e.target[1].value;
                setSearchedMissionName(userInput);
            }}>
                <div className="px-6 py-4 box-border relative transition-colors text-slate-blue-70 focus-within:text-slate-blue dark:text-white-70 dark:focus-within:text-white rounded-md w-full">
                    <span className="absolute inset-y-0 left-6 flex items-center pl-2">
                        <button type="submit" className='w-4 h-4'>
                            <SearchIcon />
                        </button>
                    </span>
                    <input type="search" className="w-full box-border py-2 text-sm transition-colors bg-gray-medium text-slate-blue-70 focus:text-slate-blue dark:bg-dark-gray-medium dark:text-white-70 dark:focus:text-white rounded-md pl-8 focus:outline-none" placeholder="Search by Mission Name" autoComplete="off" />
                </div>
            </form>
            {
                loading ?
                    <div className='flex justify-center items-center p-12'>
                        <LoadingSpinner className='h-7 w-7' />
                    </div>
                    :
                    launchData && launchData?.length > 0 ?
                        <div className='flex flex-col justify-start items-center shrink overflow-y-auto'>
                            <table className="table-auto w-full">
                                <thead className='text-sm transition-colors text-slate-blue dark:text-white text-left'>
                                    <tr>
                                        <th className='font-medium pl-4 pr-2 py-2'>Mission Name</th>
                                        <th className='font-medium pr-2 py-2'>Date</th>
                                        <th className='font-medium pr-2 py-2'>Outcome</th>
                                        <th className='font-medium pr-2 py-2'>Rocket</th>
                                        <th className='font-medium pr-2 py-2'>Payload Mass</th>
                                        <th className='font-medium pr-2 py-2'>Site</th>
                                        <th className='font-medium pr-4 py-2'>Mission ID</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm transition-colors text-slate-blue dark:text-dark-gray-lighter-still'>
                                    {
                                        launchData.map((data: launchData, idx, array) => (
                                            <tr key={data.timestampUnix} className={`transition-colors border-gray-light dark:border-dark-gray-medium rounded-full ${idx === array.length - 1 ? "" : "border-b-2"}`}>
                                                <td className='py-1.5 pr-2 pl-4'>{data.name}</td>
                                                <td className='py-2 pr-2'>{new Date(data.timestampUnix * 1000).toLocaleString('en-US', { timeZoneName: "short" })}</td>
                                                <td className={`py-1.5 pr-2 font-medium transition-colors ${data.success ? "text-teal dark:text-light-teal" : "text-red dark:text-red"}`}>{data.success ? "Success" : "Failure"}</td>
                                                <td className='py-1.5 pr-2'>{data.rocketName}</td>
                                                <td className='py-1.5 pr-2'>{data.payloadMassKG} kg</td>
                                                <td className='py-1.5 pr-2'>{data.siteName}</td>
                                                <td className='py-1.5 pr-4'>{data.missionId}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        <p className='text-dark-purple dark:text-white transition-colors text-l font-medium p-4 text-center'>
                            {searchedMissionName ? "Your search yielded 0 results." : "SpaceX has not launched any payloads at this site."}
                        </p>
            }
        </div>
    )
}
