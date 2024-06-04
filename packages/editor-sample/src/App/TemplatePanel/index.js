import React, { useEffect, useState } from 'react';
import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';
import EditorBlock from '../../documents/editor/EditorBlock';
import { setSelectedScreenSize, useDocument, useSelectedMainTab, useSelectedScreenSize, } from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';
import EditJson from './EditJson';
export default function TemplatePanel() {
    const document = useDocument();
    const selectedMainTab = useSelectedMainTab();
    const selectedScreenSize = useSelectedScreenSize();
    const [editMode, setEditMode] = useState(false);
    const url = new URL(window.location.href);
    const hash = url.hash.slice(1); // remove the leading '#'
    const [path, queryParams] = hash.split('?'); // split by '?'
    console.log(queryParams);
    const parts = path.split('/'); // split by '/'
    const id = parts[parts.length - 1]; // take the last part
    const hasId = !isNaN(Number(id));
    useEffect(() => {
        if (hash.startsWith('sample/edit-template') && hasId === true) {
            setEditMode(true);
        }
    }, [hasId]);
    let mainBoxSx = {
        height: '100%',
    };
    if (selectedScreenSize === 'mobile') {
        mainBoxSx = Object.assign(Object.assign({}, mainBoxSx), { margin: '32px auto', width: 370, height: 800, boxShadow: 'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px' });
    }
    const handleScreenSizeChange = (_, value) => {
        switch (value) {
            case 'mobile':
            case 'desktop':
                setSelectedScreenSize(value);
                return;
            default:
                setSelectedScreenSize('desktop');
        }
    };
    const renderMainPanel = () => {
        switch (selectedMainTab) {
            case 'editor':
                return (React.createElement(Box, { sx: mainBoxSx },
                    React.createElement(EditorBlock, { id: "root" })));
            case 'preview':
                return (React.createElement(Box, { sx: mainBoxSx },
                    React.createElement(Reader, { document: document, rootBlockId: "root" })));
            case 'html':
                return React.createElement(HtmlPanel, null);
            case 'json':
                return React.createElement(JsonPanel, null);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Stack, { sx: {
                height: 49,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 'appBar',
                px: 1,
            }, direction: "row", justifyContent: "space-between", alignItems: "center" },
            React.createElement(ToggleSamplesPanelButton, null),
            React.createElement(Stack, { px: 2, direction: "row", gap: 2, width: "100%", justifyContent: "space-between", alignItems: "center" },
                React.createElement(Stack, { direction: "row", spacing: 2 },
                    React.createElement(MainTabsGroup, null)),
                React.createElement(Stack, { direction: "row", spacing: 2 },
                    !!!editMode ? (React.createElement(DownloadJson, null)) : (React.createElement(EditJson, { id: Number(id) })),
                    React.createElement(ImportJson, null),
                    React.createElement(ToggleButtonGroup, { value: selectedScreenSize, exclusive: true, size: "small", onChange: handleScreenSizeChange },
                        React.createElement(ToggleButton, { value: "desktop" },
                            React.createElement(Tooltip, { title: "Desktop view" },
                                React.createElement(MonitorOutlined, { fontSize: "small" }))),
                        React.createElement(ToggleButton, { value: "mobile" },
                            React.createElement(Tooltip, { title: "Mobile view" },
                                React.createElement(PhoneIphoneOutlined, { fontSize: "small" })))),
                    React.createElement(ShareButton, null))),
            React.createElement(ToggleInspectorPanelButton, null)),
        React.createElement(Box, { sx: { height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: 370 } }, renderMainPanel())));
}
//# sourceMappingURL=index.js.map