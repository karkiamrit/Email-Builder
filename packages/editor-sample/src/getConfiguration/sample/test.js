import { useEffect } from 'react';
import { useFetchNotification } from './hook/useFetchNotification';
export default function Test() {
    const { data } = useFetchNotification('1');
    useEffect(() => {
        console.log(data);
    }, [data]);
    console.log(data);
    const EMPTY_EMAIL_MESSAGE = {
        root: {
            type: 'EmailLayout',
            data: {
                backdropColor: '#F5F5F5',
                canvasColor: '#FFFFFF',
                textColor: '#262626',
                fontFamily: 'MODERN_SANS',
                childrenIds: [],
            },
        },
    };
    return EMPTY_EMAIL_MESSAGE;
}
//# sourceMappingURL=test.js.map