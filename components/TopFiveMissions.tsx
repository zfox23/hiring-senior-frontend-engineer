import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { launchesData, launchpad, missionsData, payloadsData } from '../helpers/helperFunctions';
import ReactTooltip from 'react-tooltip';
import NoSsr from './NoSSR';
import { LoadingSpinner } from './LoadingSpinner';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

const TOP_FIVE_MISSIONS_DATA = gql`
    query GetTopFiveMissionsData($selectedLaunchpadID: String) {
        launches(find: {site_id: $selectedLaunchpadID}) {
            launch_site {
                site_id
            }
            mission_id
        }
        missions {
            payloads {
                id
            }
            id
            name
        }
        payloads {
            id
            payload_mass_kg
        }
    }
`;

const TopFiveMissionsHeader = ({ isDarkTheme }: { isDarkTheme: Boolean }) => {
    return (
        <div className='flex items-center border-b-4 p-3 transition-colors border-gray-light dark:border-dark-gray-medium'>
            <h2 className='text-dark-purple dark:text-white transition-colors text-xl font-semibold'>Top 5 Missions</h2>
            <QuestionMarkCircleIcon data-tip="" data-for='topFiveHelp' className='w-5 h-5 ml-2 mb-0.5 text-dark-purple dark:text-white transition-colors' />
            <NoSsr>
                <ReactTooltip
                    id="topFiveHelp"
                    type='error'
                    // fullConfig.theme.colors['dark-purple']
                    textColor={`${isDarkTheme ? "#1C1F37" : "#FFFFFF"}`}
                    // fullConfig.theme.colors['dark-blue']
                    backgroundColor={`${isDarkTheme ? "#FFFFFF" : "#111827"}`}
                    // fullConfig.theme.colors['dark-gray-light']
                    arrowColor={`${isDarkTheme ? "#FFFFFF" : "#3B3B3C"}`}>
                    This table displays the top 5 missions by payload mass launched at the selected launch site.
                </ReactTooltip>
            </NoSsr>
        </div>
    )
}

interface topFiveMissionsData {
    title: string;
    massKg: number;
}

export const TopFiveMissionsCard = ({ selectedLaunchpad }: { selectedLaunchpad: launchpad }) => {
    const [topFiveMissionsData, setTopFiveMissionsData] = useState<topFiveMissionsData[]>();

    const { loading, error, data } = useQuery(TOP_FIVE_MISSIONS_DATA, {
        variables: { selectedLaunchpadID: selectedLaunchpad.id === "custom_all" ? null : selectedLaunchpad.id },
    });

    useEffect(() => {
        if (loading || error) {
            setTopFiveMissionsData(undefined);

            if (error) {
                console.error(`Error in \`useQuery()\`:\n${error}`);
            }
            return;
        }

        if (!(data && data.launches && data.launches.length > 0)) {
            setTopFiveMissionsData(undefined);
            return;
        }

        let tempTopFiveMissionsData: topFiveMissionsData[] = [];
        let relevantMissionIDs = new Set();

        // 1. Iterate through the `data.launches` array to
        // obtain a `Set()` of relevant, unique Mission IDs.
        data.launches.forEach((launchesData: launchesData) => {
            // Don't parse launches which don't have any associated Mission IDs.
            if (!launchesData.mission_id.length) {
                return;
            }

            // `launchesData.mission_id` is an array, although I've only ever noticed
            // that array have a length of 0 or 1.
            launchesData.mission_id.forEach((missionID: string) => { relevantMissionIDs.add(missionID); });
        });

        // 2. Filter the `data.missions` array to obtain only missions which
        // have launched at the filtered site.
        // Note: As far as I have found, 
        // only missions have payloads associated with them; launches do not have associated payloads.
        const filteredMissionsData = data.missions.filter((mission: missionsData) => {
            return relevantMissionIDs.has(mission.id);
        });

        // 3. Obtain a `Set()` of relevant, unique Payload IDs.
        // Note: This logic assumes that any given Payload associated with a given Payload ID
        // is only launched on a single mission. If this isn't true, this data is going to be wrong.
        filteredMissionsData.forEach((mission: missionsData) => {
            if (!(mission.payloads && mission.payloads.length > 0 && mission.name)) {
                return;
            }

            let currentData: topFiveMissionsData = {
                title: mission.name,
                massKg: 0,
            }
            let relevantPayloadIDs = new Set();

            mission.payloads.forEach((payload) => {
                if (payload && payload.id) {
                    relevantPayloadIDs.add(payload.id);
                }
            });

            const filteredPayloadsData = data.payloads.filter((payload: payloadsData) => {
                return relevantPayloadIDs.has(payload.id);
            });

            filteredPayloadsData.forEach((payload: payloadsData) => {
                if (!payload.payload_mass_kg) {
                    return;
                }
                currentData.massKg += payload.payload_mass_kg;
            });

            tempTopFiveMissionsData.push(currentData);
        });

        setTopFiveMissionsData(tempTopFiveMissionsData.slice(0, 5).sort((a, b) => { return b.massKg - a.massKg; }));
    }, [data]);

    const isDarkTheme = typeof window !== 'undefined' && localStorage.theme === "dark";

    return (
        <div className='flex flex-col bg-white dark:bg-dark-gray-light transition-colors rounded-md shadow-md'>
            <TopFiveMissionsHeader isDarkTheme={isDarkTheme} />
            {
                loading ?
                    <div className='flex justify-center items-center p-12'>
                        <LoadingSpinner className='h-7 w-7' />
                    </div>
                    :
                    topFiveMissionsData && topFiveMissionsData?.length > 0 ?
                        <div className='flex justify-center items-center p-4'>
                            <table className="table-auto">
                                <thead className='text-sm transition-colors text-slate-blue dark:text-white text-left'>
                                    <tr>
                                        <th className='font-light'>MISSION</th>
                                        <th className='font-light'>PAYLOAD MASS</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm transition-colors text-slate-blue dark:text-dark-gray-lighter-still'>
                                    {
                                        topFiveMissionsData.map((data: topFiveMissionsData, idx, array) => (
                                            <tr key={data.title} className={`transition-colors border-gray-light dark:border-dark-gray-medium rounded-full ${idx === array.length - 1 ? "" : "border-b-2"}`}>
                                                <td className='py-1.5 pr-2 font-medium'>
                                                    <span>{data.title}</span>
                                                </td>
                                                <td className=''>
                                                    <div className='flex items-center justify-between gap-4'>
                                                        <span>{Math.round(data.massKg)} kg</span>
                                                        <div className='w-48 h-1.5 flex gap-0.5'>
                                                            <div className='h-1.5 rounded-full transition-colors bg-black dark:bg-gray-darker' style={{ "width": `${100 * data.massKg / topFiveMissionsData.reduce((currentMax, a) => Math.max(currentMax, a.massKg), 0)}%` }} />
                                                            <div className='h-1.5 rounded-full transition-colors bg-gray-medium dark:bg-dark-gray-lightish grow' />
                                                        </div>
                                                    </div>
                                                </td>
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
