export const setPageTheme = () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export interface Launchpad {
    id: string;
    name: string;
}
export const launchpadAll = { "id": "custom_all", "name": "All Launch Sites" };

export interface LaunchSite {
    site_id: string;
    site_name?: string;
}
export interface RocketPayloadData {
    payload_weights: [kg: number];
}
export interface RocketData {
    rocket_name: string;
    rocket: RocketPayloadData;
}
export interface LaunchesData {
    launch_site: LaunchSite;
    mission_id: [string];
    launch_date_unix?: number;
    launch_success?: Boolean;
    mission_name?: string;
    rocket?: RocketData;
}
export interface PayloadsData {
    id: string;
    customers?: [string];
    payload_mass_kg?: number;
    nationality?: string;
}
export interface MissionsData {
    id: string;
    name?: string;
    payloads: [PayloadsData];
}
export interface AllLaunchesTableData {
    mission_name: string;
    launch_date_unix: number;
    launch_success: Boolean;
    rocket_name: string;
    kg: number;
    site_name: string;
    mission_id: string;
}

export const randBetween = (seed: number, min: number, max: number) => {
    return min + (Math.floor(Math.abs((Math.sin(seed++) * 10000))) % (max - min));
}

export const colorFromString = (str: string) => {
    // Create a random color based on the player ID. All clients should render players consistently, with a unique color            
    let seed = str.charCodeAt(0) ^ str.charCodeAt(3);
    let color = { r: (randBetween(seed + 1, 50, 230)).toString(16), g: (randBetween(seed + 2, 80, 200)).toString(16), b: (randBetween(seed + 3, 20, 250)).toString(16) };
    return "#" + color.r + color.g + color.b;
}
