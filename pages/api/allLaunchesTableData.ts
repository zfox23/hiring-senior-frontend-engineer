// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GraphQLClient, gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
import { allLaunchesTableData, launchesData } from '../../helpers/helperFunctions';

type EndpointResponseData = {
    data: allLaunchesTableData[],
    status: string,
    endpoint: string
}

const client = new GraphQLClient(`https://api.spacex.land/graphql/`);

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

export default async function handler(req: NextApiRequest, res: NextApiResponse<EndpointResponseData>) {
    const {
        selectedLaunchpadID,
        searchedMissionName,
        limit,
        offset,
        sortColumn,
        sortDescending } = req.body;

    const data = await client.request(LAUNCH_DATA, {
            selectedLaunchpadID: selectedLaunchpadID === "custom_all" ? null : selectedLaunchpadID,
            searchedMissionName
    });
    
    let tempLaunchData: allLaunchesTableData[] = [];
    data.launches.forEach((launchData: launchesData) => {
        if (!(launchData.mission_name && launchData.launch_date_unix && typeof launchData.launch_success === "boolean" && launchData.rocket && launchData.launch_site && launchData.launch_site.site_name && launchData.mission_id && launchData.mission_id.length > 0)) {
            return;
        }

        tempLaunchData.push({
            mission_name: launchData.mission_name,
            launch_date_unix: launchData.launch_date_unix,
            launch_success: launchData.launch_success,
            rocket_name: launchData.rocket?.rocket_name,
            kg: launchData.rocket?.rocket.payload_weights.reduce((sum, a: any) => sum + a.kg, 0),
            site_name: launchData.launch_site.site_name,
            // Assume the first `mission_id` is the one we should use for display.
            mission_id: launchData.mission_id[0]
        });
    });

    let sortedData: allLaunchesTableData[] = tempLaunchData.sort((a: any, b: any) => {
        let initialDataA = a[sortColumn];
        let initialDataB = b[sortColumn];

        if (typeof initialDataA === "string") {
            if (initialDataA < initialDataB) {
                return sortDescending ? -1 : 1;
            }
            if (initialDataA > initialDataB) {
                return sortDescending ? 1 : -1;
            }
            return 0;
        } else {
            if (sortDescending) {
                return (initialDataB - initialDataA);
            } else {
                return (initialDataA - initialDataB);
            }
        }
    });

    console.log(req.body);
    res.status(200).json({
        data: sortedData,
        status: "ok",
        endpoint: "/api/allLaunchesTableData"
    });
}
