import React, { Fragment, useState } from 'react';
import { Listbox, Popover, Switch, Transition } from '@headlessui/react';
import { setPageTheme } from '../helpers/helperFunctions';
import { usePopper } from 'react-popper';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { CheckIcon } from '@heroicons/react/solid'

const LAUNCH_SITES = gql`
    query GetLaunchSites {
        launchpads {
            id
            name
        }
    }
`;

interface launchpad {
    id: string;
    name: string;
}

const LaunchPadOption = ({ launchpad, active, selected }: { launchpad: launchpad, active: Boolean, selected: Boolean }) => {
    return (
        <Listbox.Option
            key={launchpad.id}
            value={launchpad}
            as={Fragment}>
            {({ active, selected }) => (
                <li className={`rounded-md flex items-center justify-start gap-2 p-2 cursor-pointer ${active || selected ? 'bg-blue text-white dark:text-white' : ' text-black dark:text-white'}`}>
                    {selected && <span className='flex items-center'><CheckIcon className="w-5 h-5" /></span>}
                    <span className={`text-sm ${selected ? 'font-semibold' : 'font-medium'}`}>{launchpad.name}</span>
                </li>)}
        </Listbox.Option>
    )
}

const launchpadAll = { "id": "custom_all", "name": "All Launchpads" };

const LaunchSiteSelector = () => {
    const [selectedLaunchpad, setSelectedLaunchpad] = useState<launchpad>(launchpadAll);
    const { loading, error, data } = useQuery(LAUNCH_SITES);

    const popperElRef = React.useRef(null);
    const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
    const { styles, attributes } = usePopper(targetElement, popperElement, {
        placement: "bottom-end",
        modifiers: [
            {
                name: "offset",
                enabled: true,
                options: {
                    offset: [0, -7]
                }
            }
        ]
    });

    if (loading || error) {
        return (
            <div className={`inline-flex w-48 h-10 items-center justify-between rounded-md shadow-sm transition-colors bg-white hover:bg-gray-medium dark:bg-dark-gray-light dark:hover:bg-dark-gray-lighter`}>
                <div className='flex items-center transition-colors'>
                    <div className={`inline-flex items-center justify-center w-10 h-10 mr-1 transition-colors bg-office-building-blue dark:bg-office-building-white bg-no-repeat bg-center`} />
                    <span className={`transition-colors text-sm font-medium text-blue dark:text-white`}>{launchpadAll.name}</span>
                </div>
                <div className={`w-10 h-10 mr-1 bg-chevron-down-blue dark:bg-chevron-down-white bg-no-repeat bg-center`} />
            </div>
        )
    }

    return (
        <Listbox value={selectedLaunchpad} onChange={(item) => { setSelectedLaunchpad(item); }}>
            {({ open }) => (
                <>
                    <div ref={setTargetElement}>
                        <Listbox.Button className={`inline-flex w-48 h-10 items-center justify-between rounded-md shadow-sm transition-colors ${open ? 'bg-blue' : 'bg-white hover:bg-gray-medium dark:bg-dark-gray-light dark:hover:bg-dark-gray-lighter'}`}>
                            <div className='flex items-center transition-colors'>
                                <div className={`inline-flex items-center justify-center w-10 h-10 transition-colors ${open ? 'bg-office-building-white' : 'bg-office-building-blue dark:bg-office-building-white'} bg-no-repeat bg-center`} />
                                <span className={`w-28 text-left truncate transition-colors text-sm font-medium ${open ? 'text-white' : 'text-blue dark:text-white'}`}>{selectedLaunchpad.name}</span>
                            </div>
                            <div className={`w-10 h-10 mr-1 ${open ? 'bg-chevron-up-white dark:bg-chevron-up-white' : 'bg-chevron-down-blue dark:bg-chevron-down-white'} bg-no-repeat bg-center`} />
                        </Listbox.Button>
                    </div>
                    <div
                        ref={popperElRef}
                        style={styles.popper}
                        {...attributes.popper}>
                        <Transition
                            enter="transition duration-300 ease-out transform"
                            enterFrom="-translate-y-2 opacity-0"
                            enterTo="translate-y-0 opacity-100"
                            leave="transition duration-100 ease-out transform"
                            leaveFrom="translate-y-0 opacity-100"
                            leaveTo="-translate-y-2 opacity-0"
                            beforeEnter={() => setPopperElement(popperElRef.current)}
                            afterLeave={() => setPopperElement(null)}
                        >
                            <Listbox.Options
                                className="w-48 shadow-md rounded-md bg-white dark:bg-dark-gray-darker transition-colors">
                                <Listbox.Option
                                    key={launchpadAll.id}
                                    value={launchpadAll}
                                    as={Fragment}>
                                    {({ active, selected }) => (
                                        <LaunchPadOption launchpad={launchpadAll} active={active} selected={selected} />
                                    )}
                                </Listbox.Option>
                                {
                                    data.launchpads.map((launchpad: launchpad) => (
                                        <Listbox.Option
                                            key={launchpad.id}
                                            value={launchpad}
                                            as={Fragment}>
                                            {({ active, selected }) => (
                                                <LaunchPadOption launchpad={launchpad} active={active} selected={selected} />
                                            )}
                                        </Listbox.Option>
                                    ))
                                }
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}

export const Header = () => {
    const [darkModeEnabled, setDarkModeEnabled] = useState(typeof window !== 'undefined' && localStorage.theme === 'dark');
    const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);;
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);;
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "bottom-end",
        modifiers: [
            {
                name: "offset",
                enabled: true,
                options: {
                    offset: [0, -4]
                }
            }
        ]
    });

    return (
        <header className='flex justify-between w-full'>
            <h1 className='text-2xl font-bold transition-colors text-dark-blue dark:text-white'>SpaceX Mission Dashboard</h1>
            <div className='flex gap-2'>
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button ref={setReferenceElement} className={`inline-flex items-center justify-center w-10 h-10 mr-2 rounded-full shadow-sm transition-colors ${open ? 'bg-cog-white bg-blue' : 'bg-cog-blue bg-white hover:bg-gray-medium dark:bg-cog-white dark:bg-dark-gray-light dark:hover:bg-dark-gray-lighter'} bg-no-repeat bg-center`}>
                            </Popover.Button>
                            <Transition
                                className="absolute z-10"
                                enter="transition duration-300 ease-out transform"
                                enterFrom="-translate-y-2 opacity-0"
                                enterTo="translate-y-0 opacity-100"
                                leave="transition duration-100 ease-out transform"
                                leaveFrom="translate-y-0 opacity-100"
                                leaveTo="-translate-y-2 opacity-0"
                            >
                                <Popover.Panel
                                    className="bg-white dark:bg-dark-gray-darker transition-colors"
                                    ref={setPopperElement}
                                    style={styles.popper}
                                    {...attributes.popper}>
                                    <Switch.Group>
                                        <div className="flex items-center p-2 h-12 shadow-md rounded-md">
                                            <Switch.Label className="mr-4 w-24 text-sm font-extralight transition-colors text-slate-blue dark:text-dark-gray-lighter-still">Dark Mode</Switch.Label>
                                            <Switch
                                                checked={darkModeEnabled}
                                                onChange={(checked) => {
                                                    setDarkModeEnabled(checked);
                                                    localStorage.theme = (checked ? "dark" : "light");
                                                    setPageTheme();
                                                }}
                                                className={`${darkModeEnabled ? 'bg-blue' : 'bg-gray-dark'
                                                    } relative inline-flex items-center w-10 h-4 rounded-full transition-colors focus:outline-none`}
                                            >
                                                <span
                                                    className={`${darkModeEnabled ? 'translate-x-4' : 'translate-x-0'
                                                        } inline-block shadow-md border-2 border-gray-dark w-6 h-6 transform bg-white rounded-full transition-transform`}
                                                />
                                            </Switch>
                                        </div>
                                    </Switch.Group>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
                <LaunchSiteSelector />
            </div>
        </header>
    )
}
