import React from 'react';
import { Divider, Drawer, Stack, Typography } from '@mui/material';
import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
// import SidebarButton from './SidebarButton';
// import logo from './waypoint.svg';
export const SAMPLES_DRAWER_WIDTH = 240;
export default function SamplesDrawer() {
    const samplesDrawerOpen = useSamplesDrawerOpen();
    const message1 = '{name} = Users Name';
    const message2 = '{email} = Users Email';
    const message3 = '{phone} = Users Phone';
    return (React.createElement(Drawer, { variant: "persistent", anchor: "left", open: samplesDrawerOpen, sx: {
            width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
        } },
        React.createElement(Stack, { spacing: 3, py: 1, px: 2, width: SAMPLES_DRAWER_WIDTH, justifyContent: "space-between", height: "100%" },
            React.createElement(Stack, { spacing: 2, sx: { '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } } },
                React.createElement(Typography, { gutterBottom: true, color: 'red', align: 'center', variant: 'h4' }, "Enter the following for dynamic values"),
                React.createElement(Divider, null),
                React.createElement(Typography, { gutterBottom: true, align: 'center' }, message1),
                React.createElement(Divider, null),
                React.createElement(Typography, { gutterBottom: true, align: 'center' },
                    message2,
                    ' '),
                React.createElement(Divider, null),
                React.createElement(Typography, { gutterBottom: true, align: 'center' },
                    message3,
                    ' ')))));
}
//# sourceMappingURL=index.js.map