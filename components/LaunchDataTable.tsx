import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { launchesData, launchpad, missionsData, payloadsData } from '../helpers/helperFunctions';
import { LoadingSpinner } from './LoadingSpinner';
import { ArrowsExpandIcon } from '@heroicons/react/outline';

const LAUNCH_DATA = gql`
    query GetLaunchData($selectedLaunchpadID: String) {
        launches(find: {site_id: $selectedLaunchpadID}) {
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

const LaunchDataHeader = () => {
    return (
        <div className='flex items-center justify-between border-b-4 p-3 transition-colors border-gray-light dark:border-dark-gray-medium'>
            <h2 className='text-dark-purple dark:text-white transition-colors text-xl font-semibold'>SpaceX Launch Data</h2>
            <ArrowsExpandIcon className='w-5 h-5 ml-2 mb-0.5 text-blue dark:text-white transition-colors' />
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

export const LaunchDataCard = ({ selectedLaunchpad }: { selectedLaunchpad: launchpad }) => {
    const [launchData, setLaunchData] = useState<launchData[]>();

    const { loading, error, data } = useQuery(LAUNCH_DATA, {
        variables: { selectedLaunchpadID: selectedLaunchpad.id === "custom_all" ? null : selectedLaunchpad.id },
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

            console.log(launchData.rocket?.rocket.payload_weights.reduce((sum, a) => sum + a, 0))

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
        <div className='flex flex-col bg-white dark:bg-dark-gray-light transition-colors rounded-md shadow-md'>
            <LaunchDataHeader />
            {
                loading ?
                    <div className='flex justify-center items-center p-12'>
                        <LoadingSpinner className='h-7 w-7' />
                    </div>
                    :
                    launchData && launchData?.length > 0 ?
                        <div className='flex justify-center items-center'>
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
                                                <td className='py-2 pr-2'>{new Date(data.timestampUnix * 1000).toLocaleString('en-US', {timeZoneName: "short"})}</td>
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
                            SpaceX has not launched any payloads at this site.
                        </p>
            }
        </div>
    )
}
