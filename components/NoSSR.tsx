// This component exists due to a bug with `react-tooltip`.
// I obtained this solution, which ensures that a component has been mounted before it is rendered,
// from here: https://stackoverflow.com/questions/64079321/react-tooltip-and-next-js-ssr-issue/64360133

import React, { useEffect, useState } from 'react';

const NoSsr: React.FC = ({ children }) => {
    const [isMounted, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);

    return <>{isMounted ? children : null}</>;
};

export default NoSsr;
