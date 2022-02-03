import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { colorFromString, launchesData, launchpad, missionsData, payloadsData } from '../helpers/helperFunctions';
import ReactTooltip from 'react-tooltip';
import NoSsr from './NoSSR';
import { LoadingSpinner } from './LoadingSpinner';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

const PAYLOAD_COUNT_BY_NATIONALITY_DATA = gql`
    query GetPayloadCountByNationalityData($selectedLaunchpadID: String) {
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
        }
        payloads {
            id
            nationality
        }
    }
`;

const NationalityHeader = ({ isDarkTheme }: { isDarkTheme: Boolean }) => {
    return (
        <div className='flex items-center border-b-4 p-3 transition-colors border-gray-light dark:border-dark-gray-medium'>
            <h2 className='text-dark-purple dark:text-white transition-colors text-xl font-semibold'>Payload Count by Nationality</h2>
            <QuestionMarkCircleIcon data-tip="" data-for='countHelp' className='w-5 h-5 ml-2 mb-0.5 text-dark-purple dark:text-white transition-colors' />
            <NoSsr>
                <ReactTooltip
                    id="countHelp"
                    type='error'
                    // fullConfig.theme.colors['dark-purple']
                    textColor={`${isDarkTheme ? "#1C1F37" : "#FFFFFF"}`}
                    // fullConfig.theme.colors['dark-blue']
                    backgroundColor={`${isDarkTheme ? "#FFFFFF" : "#111827"}`}
                    // fullConfig.theme.colors['dark-gray-light']
                    arrowColor={`${isDarkTheme ? "#FFFFFF" : "#3B3B3C"}`}>
                    This data displays which countries are responsible for the payloads launched at the selected launch site.
                </ReactTooltip>
            </NoSsr>
        </div>
    )
}

interface pieChartData {
    title: string;
    value: number;
    color: string;
}

export const PayloadCountByNationalityCard = ({ selectedLaunchpad }: { selectedLaunchpad: launchpad }) => {
    const [pieChartData, setPieChartData] = useState<pieChartData[]>();
    const [hovered, setHovered] = useState<number | null>(null);

    const { loading, error, data } = useQuery(PAYLOAD_COUNT_BY_NATIONALITY_DATA, {
        variables: { selectedLaunchpadID: selectedLaunchpad.id === "custom_all" ? null : selectedLaunchpad.id },
    });

    useEffect(() => {
        if (loading || error) {
            setPieChartData(undefined);

            if (error) {
                console.error(`Error in \`useQuery()\`:\n${error}`);
            }
            return;
        }

        if (!(data && data.launches && data.launches.length > 0)) {
            setPieChartData(undefined);
            return;
        }

        let tempPieChartData: pieChartData[] = [];
        let relevantMissionIDs = new Set();
        let relevantPayloadIDs = new Set();

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
            mission.payloads.forEach((payload) => { if (payload && payload.id) { relevantPayloadIDs.add(payload.id); } });
        });

        // 4. Filter the `data.payloads` array to obtain only payloads
        // which have launched at the filtered site.
        const filteredPayloadsData = data.payloads.filter((payload: payloadsData) => {
            return relevantPayloadIDs.has(payload.id);
        });

        // 5. Using the filtered payloads data, compute the desired values.
        filteredPayloadsData.forEach((payload: payloadsData) => {
            if (!(payload && payload.id && payload.nationality)) {
                return;
            }

            let found = tempPieChartData.find((data: pieChartData) => { return data.title === payload.nationality; });
            if (!found) {
                tempPieChartData.push({
                    title: payload.nationality,
                    value: 1,
                    color: colorFromString(payload.nationality)
                });
            } else {
                found.value++;
            }
        });

        setPieChartData(tempPieChartData.sort((a, b) => { return b.value - a.value; }));
    }, [data]);

    const makeTooltipContent = (hoveredData: pieChartData) => {
        return (
            <div className='flex items-center p-1'>
                <span className={`rounded-full w-3 h-3 mr-3 mb-0.5`} style={{ "backgroundColor": hoveredData.color }} />
                <p className='text-sm text-white dark:text-slate-blue'>{hoveredData.title}</p>
                <p className='font-bold text-sm dark:text-dark-blue ml-3'>{hoveredData.value}</p>
            </div>
        );
    }

    const isDarkTheme = typeof window !== 'undefined' && localStorage.theme === "dark";

    return (
        <div className='flex flex-col bg-white dark:bg-dark-gray-light transition-colors rounded-md shadow-md'>
            <NationalityHeader isDarkTheme={isDarkTheme} />
            {
                loading ?
                    <div className='flex justify-center items-center p-12'>
                        <LoadingSpinner className='h-7 w-7' />
                    </div>
                    :
                    pieChartData && pieChartData?.length > 0 ?
                        <div className='flex justify-center items-start p-4 gap-8'>
                            <div className='max-w-[120px]' data-tip="" data-for="chart">
                                <PieChart
                                    data={pieChartData}
                                    lineWidth={15}
                                    paddingAngle={15}
                                    rounded
                                    onMouseOver={(_, index) => {
                                        setHovered(index);
                                    }}
                                    onMouseOut={() => {
                                        setHovered(null);
                                    }}
                                />
                                <NoSsr>
                                    <ReactTooltip
                                        id="chart"
                                        // fullConfig.theme.colors['dark-purple']
                                        textColor={`${isDarkTheme ? "#1C1F37" : "#FFFFFF"}`}
                                        // fullConfig.theme.colors['dark-blue']
                                        backgroundColor={`${isDarkTheme ? "#FFFFFF" : "#111827"}`}
                                        // fullConfig.theme.colors['dark-gray-light']
                                        arrowColor={`${isDarkTheme ? "#FFFFFF" : "#3B3B3C"}`}
                                        getContent={() => {
                                            return typeof hovered === 'number' && pieChartData ? makeTooltipContent(pieChartData[hovered]) : null
                                        }}
                                    />
                                </NoSsr>
                            </div>
                            <div className='flex flex-col'>
                                <table className="table-auto">
                                    <thead className='text-sm transition-colors text-slate-blue dark:text-white text-left'>
                                        <tr>
                                            <th className='font-light'>NATIONALITY</th>
                                            <th className='font-light'>PAYLOAD COUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-sm transition-colors text-slate-blue dark:text-dark-gray-lighter-still'>
                                        {
                                            pieChartData ?
                                                pieChartData.map((data: pieChartData, idx, array) => (
                                                    <tr key={data.title} className={`transition-colors border-gray-light dark:border-dark-gray-medium rounded-full ${idx === array.length - 1 ? "" : "border-b-2"}`}>
                                                        <td className='flex items-center py-1.5 mr-4'>
                                                            <span className={`rounded-full w-2 h-2 mr-1 mb-0.5`} style={{ "backgroundColor": data.color }} />
                                                            <span>{data.title}</span></td>
                                                        <td>{data.value}</td>
                                                    </tr>
                                                ))
                                                : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <p className='text-dark-purple dark:text-white transition-colors text-l font-medium p-4 text-center'>
                            SpaceX has not launched any payloads at this site.
                        </p>
            }
        </div>
    )
}
