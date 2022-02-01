import { useEffect } from 'react';

const bodyClassAdd = (className: string) => document.body.classList.add(className);
const bodyClassRemove = (className: string) => document.body.classList.remove(className);

export default function useBodyClass(className: Array<string> | string) {
    useEffect(() => {
        className instanceof Array ? className.map(bodyClassAdd) : bodyClassAdd(className);

        return () => {
            className instanceof Array ? className.map(bodyClassRemove) : bodyClassRemove(className);
        };
    }, [className] );
}