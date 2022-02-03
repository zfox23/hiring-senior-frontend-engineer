import { useQuery } from '@apollo/client';
import { ArchiveIcon, ScaleIcon, UserCircleIcon } from '@heroicons/react/outline';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { launchesData, launchpad, missionsData, payloadsData } from '../helpers/helperFunctions';
import { LoadingSpinner } from './LoadingSpinner';

const LAUNCH_SUMMARY_DATA = gql`
    query GetLaunchSummaryData($selectedLaunchpadID: String) {
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
            customers
            id
            payload_mass_kg
        }
    }
`;

enum SummaryCardType {
    TotalPayloads = 0,
    AvgPayloadMass = 1,
    UniqueCustomers = 2,
}

const SummaryCardIcon = ({summaryCardType}: {summaryCardType: SummaryCardType}) => {
    switch (summaryCardType) {
        default:
        case (SummaryCardType.TotalPayloads):
            return (
                <ArchiveIcon className='w-6 h-6 mt-0.5 text-dark-teal dark:text-teal transition-colors' />
            )
            break;
        case (SummaryCardType.AvgPayloadMass):
            return (
                <ScaleIcon className='w-6 h-6 mt-0.5 text-purple dark:text-lilac transition-colors' />
            )
            break;
        case (SummaryCardType.UniqueCustomers):
            return (
                <UserCircleIcon className='w-6 h-6 mt-0.5 text-burnt-orange dark:text-orange transition-colors' />
            )
            break;
    }
}

const SummaryCard = ({ summaryCardType, data, label, loading }: { summaryCardType: SummaryCardType, data?: string | number | undefined, label: string, loading: Boolean }) => {
    return (
        <div className='flex align-top w-1/3 gap-2 bg-gray-dark dark:bg-dark-gray-dark transition-colors rounded-md p-3'>
            <SummaryCardIcon summaryCardType={summaryCardType} />
            <div className='flex flex-col'>
                {
                    loading ?
                        <div className='h-7 w-7 flex items-center'>
                            <LoadingSpinner className='h-3 w-3' />
                        </div>
                        :
                        <p className='text-dark-purple dark:text-white transition-colors text-xl font-semibold'>{data}</p>
                }
                <p className='text-slate-blue dark:text-dark-gray-lighter-still transition-colors text-sm'>{label}</p>
            </div>
        </div>
    )
}

export const SummaryCards = ({ selectedLaunchpad }: { selectedLaunchpad: launchpad }) => {
    const [totalPayloads, setTotalPayloads] = useState<number>();
    const [avgPayloadMass, setAvgPayloadMass] = useState<number>();
    const [numUniquePayloadCustomers, setNumUniquePayloadCustomers] = useState<number>();

    const { loading, error, data } = useQuery(LAUNCH_SUMMARY_DATA, {
        variables: { selectedLaunchpadID: selectedLaunchpad.id === "custom_all" ? null : selectedLaunchpad.id },
    });

    useEffect(() => {
        if (loading || error) {
            setTotalPayloads(undefined);
            setAvgPayloadMass(undefined);
            setNumUniquePayloadCustomers(undefined);

            if (error) {
                console.error(`Error in \`useQuery()\`:\n${error}`);
            }
            return;
        }

        if (!(data && data.launches && data.launches.length > 0)) {
            setTotalPayloads(0);
            setAvgPayloadMass(0);
            setNumUniquePayloadCustomers(0);
            return;
        }

        let tempTotalPayloads = 0;
        let tempAvgPayloadMass = 0;
        let tempUniquePayloadCustomers = new Set();
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
            if (!(payload && payload.id && payload.payload_mass_kg)) {
                return;
            }

            tempTotalPayloads++;
            tempAvgPayloadMass += payload.payload_mass_kg;
            payload.customers?.forEach((customer: string) => {
                tempUniquePayloadCustomers.add(customer);
            });
        });

        setTotalPayloads(tempTotalPayloads);
        setAvgPayloadMass(tempTotalPayloads > 0 ? tempAvgPayloadMass / tempTotalPayloads : undefined);
        setNumUniquePayloadCustomers(tempUniquePayloadCustomers.size);
    }, [data]);

    return (
        <div className='flex justify-center gap-4'>
            <SummaryCard summaryCardType={SummaryCardType.TotalPayloads} data={(loading || error) ? '--' : totalPayloads} label='Total Payloads' loading={loading} />
            <SummaryCard summaryCardType={SummaryCardType.AvgPayloadMass} data={`${avgPayloadMass && !loading && !error ? Math.round(avgPayloadMass) : "--"} kg`} label='Avg. Payload Mass' loading={loading} />
            <SummaryCard summaryCardType={SummaryCardType.UniqueCustomers} data={(loading || error) ? '--' : numUniquePayloadCustomers} label='Unique Customers' loading={loading} />
        </div>
    )
}
