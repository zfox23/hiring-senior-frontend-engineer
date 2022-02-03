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
        <div className='flex items-center border-b-4 border-gray-light dark:border-dark-gray-medium'>
            <h2 className='text-dark-purple dark:text-white transition-colors text-xl font-semibold p-3'>Payload Count by Nationality</h2>
            <QuestionMarkCircleIcon data-tip="" data-for='countHelp' className='w-5 h-5 text-dark-purple dark:text-white transition-colors' />
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
                    Pie chart shows all nationalities. Data table only shows top 5.
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

        console.log(tempPieChartData)
        setPieChartData(tempPieChartData);
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
        <div className='flex flex-col w-1/2 bg-white dark:bg-dark-gray-light transition-colors rounded-md shadow-md'>
            <NationalityHeader isDarkTheme={isDarkTheme} />
            <div className='flex justify-center items-center p-8 gap-4'>
                {
                    loading ?
                        <LoadingSpinner className='h-7 w-7' />
                        :
                        <div>
                            <div className='w-1/3' data-tip="" data-for="chart">
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
                            <div className='w-2/3'>

                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
