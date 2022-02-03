import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { launchesData, launchpad, missionsData, payloadsData } from '../helpers/helperFunctions';

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

const SummaryCard = ({ imgSrc, data, label }: { imgSrc: string, data?: string | number | undefined, label: string }) => {
    return (
        <div className='flex align-top w-1/3 gap-2 bg-gray-dark dark:bg-dark-gray-dark transition-colors rounded-md p-3'>
            <img src={imgSrc} className='w-6 h-6 mt-0.5' />
            <div className='flex flex-col'>
                <p className='text-dark-purple dark:text-white transition-colors text-xl font-semibold'>{data}</p>
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
            <SummaryCard imgSrc='/icons/archive.png' data={(loading || error) ? '--' : totalPayloads} label='Total Payloads' />
            <SummaryCard imgSrc='/icons/scale.png' data={`${avgPayloadMass && !loading && !error ? Math.round(avgPayloadMass) : "--"} kg`} label='Avg. Payload Mass' />
            <SummaryCard imgSrc='/icons/user_circle.png' data={(loading || error) ? '--' : numUniquePayloadCustomers} label='Unique Customers' />
        </div>
    )
}
