import React, {  useEffect, useState } from 'react';
import { allLaunchesTableData,  launchpad } from '../helpers/helperFunctions';
import { LoadingSpinner } from './LoadingSpinner';
import { ArrowsExpandIcon, SearchIcon } from '@heroicons/react/outline';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import axios from 'axios';
import NoSsr from './NoSSR';

const LaunchDataHeader = ({ toggleFullscreenLaunchData }: { toggleFullscreenLaunchData: () => void }) => {
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

const LaunchDataTableHeader = ({ title, sortColumnName, handleColumnClick, currentTableSortColumn, sortDescending }: { title: string, sortColumnName: string, handleColumnClick: (arg0: string) => void, currentTableSortColumn: string, sortDescending: Boolean }) => {
    return (
        <NoSsr>
            <div className='flex justify-start items-center gap-2 cursor-pointer' onClick={() => { handleColumnClick(sortColumnName) }}>
                <span>{title}</span>
                {currentTableSortColumn === sortColumnName ?
                    sortDescending ?
                        <ArrowDownIcon className="w-4 h-4" /> :
                        <ArrowUpIcon className="w-4 h-4" /> :
                    null}
            </div>
        </NoSsr>
    )
}

export const LaunchDataCard = ({ selectedLaunchpad, fullscreenLaunchData, toggleFullscreenLaunchData }: { selectedLaunchpad: launchpad, fullscreenLaunchData: Boolean, toggleFullscreenLaunchData: () => void }) => {
    const [launchData, setLaunchData] = useState<allLaunchesTableData[]>();

    const [requestInFlight, setRequestInFlight] = useState(false);
    const [searchedMissionName, setSearchedMissionName] = useState<string>();
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [sortColumn, setSortColumn] = useState((typeof window !== 'undefined' && localStorage.sortColumn) || "launch_date_unix");
    const [sortDescending, setSortDescending] = useState((typeof window !== 'undefined' && localStorage.sortDescending === "true"));

    const handleColumnClick = (newSortColumn: string) => {
        let newSortDescending;
        if (newSortColumn === sortColumn) {
            newSortDescending = !sortDescending;
        } else {
            newSortDescending = true;
            setSortColumn(newSortColumn);
        }
        setSortDescending(newSortDescending);
        
        localStorage.sortDescending = newSortDescending ? "true" : "false";
        localStorage.sortColumn = newSortColumn;
    }

    const getLaunchData = () => {
        if (!requestInFlight) {
            setLaunchData(undefined);
            setRequestInFlight(true);
            axios.post('/api/allLaunchesTableData', {
                selectedLaunchpadID: selectedLaunchpad.id,
                searchedMissionName,
                limit,
                offset,
                sortColumn,
                sortDescending
            })
                .then((response: any) => {
                    setRequestInFlight(false);
                    setLaunchData(response.data.data);
                })
                .catch((error) => {
                    setRequestInFlight(false);
                    console.error(error);
                })
        }
    }

    useEffect(() => {
        getLaunchData();
    }, [sortDescending, sortColumn, searchedMissionName, selectedLaunchpad]);

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
                <div className='flex flex-col justify-start items-center shrink overflow-y-auto'>
                    <table className="table-auto w-full">
                        <thead className='text-sm transition-colors text-slate-blue dark:text-white text-left'>
                            <tr>
                                <th className='font-medium pl-4 pr-2 py-2'>
                                    <LaunchDataTableHeader title='Mission Name' sortColumnName='mission_name' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                                <th className='font-medium pr-2 py-2'>
                                    <LaunchDataTableHeader title='Date' sortColumnName='launch_date_unix' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                                <th className='font-medium pr-2 py-2'>
                                    <LaunchDataTableHeader title='Outcome' sortColumnName='launch_success' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                                <th className='font-medium pr-2 py-2'>
                                    <LaunchDataTableHeader title='Rocket' sortColumnName='rocket_name' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                                <th className='font-medium pr-2 py-2'>
                                    <LaunchDataTableHeader title='Payload Mass' sortColumnName='kg' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                                <th className='font-medium pr-2 py-2'>
                                    <LaunchDataTableHeader title='Site' sortColumnName='site_name' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                                <th className='font-medium pr-4 py-2'>
                                    <LaunchDataTableHeader title='Mission ID' sortColumnName='mission_id' handleColumnClick={handleColumnClick} currentTableSortColumn={sortColumn} sortDescending={sortDescending} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-sm transition-colors text-slate-blue dark:text-dark-gray-lighter-still'>
                            {
                                launchData && launchData.map((data: allLaunchesTableData, idx, array) => (
                                    <tr key={data.launch_date_unix} className={`transition-colors border-gray-light dark:border-dark-gray-medium rounded-full ${idx === array.length - 1 ? "" : "border-b-2"}`}>
                                        <td className='py-1.5 pr-2 pl-4'>{data.mission_name}</td>
                                        <td className='py-2 pr-2'>{new Date(data.launch_date_unix * 1000).toLocaleString('en-US', { timeZoneName: "short" })}</td>
                                        <td className={`py-1.5 pr-2 font-medium transition-colors ${data.launch_success ? "text-teal dark:text-light-teal" : "text-red dark:text-red"}`}>{data.launch_success ? "Success" : "Failure"}</td>
                                        <td className='py-1.5 pr-2'>{data.rocket_name}</td>
                                        <td className='py-1.5 pr-2'>{data.kg} kg</td>
                                        <td className='py-1.5 pr-2'>{data.site_name}</td>
                                        <td className='py-1.5 pr-4'>{data.mission_id}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        requestInFlight ?
                            <div className='flex justify-center items-center p-12'>
                                <LoadingSpinner className='h-7 w-7' />
                            </div>
                            : !launchData || launchData.length === 0 ?
                                <p className='text-dark-purple dark:text-white transition-colors text-l font-medium p-4 text-center'>
                                    {searchedMissionName ? "Your search yielded 0 results." : "SpaceX has not launched any payloads at this site."}
                                </p>
                                : null
                    }
                </div>
            }
        </div>
    )
}
