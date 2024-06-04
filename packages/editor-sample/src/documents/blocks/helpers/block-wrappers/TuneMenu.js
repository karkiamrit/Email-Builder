import React from 'react';
import { DeleteOutlined } from '@mui/icons-material';
import { IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { resetDocument, useDocument } from '../../../editor/EditorContext';
const STYLE = {
    position: 'absolute',
    top: 0,
    left: -52,
    borderRadius: 64,
};
export default function TuneMenu({ blockId }) {
    const document = useDocument();
    const handleDeleteClick = () => {
        var _a, _b, _c;
        const filterChildrenIds = (childrenIds) => {
            if (!childrenIds) {
                return childrenIds;
            }
            return childrenIds.filter((f) => f !== blockId);
        };
        const nDocument = Object.assign({}, document);
        for (const [id, b] of Object.entries(nDocument)) {
            const block = b;
            if (id === blockId) {
                continue;
            }
            switch (block.type) {
                case 'EmailLayout':
                    nDocument[id] = Object.assign(Object.assign({}, block), { data: Object.assign(Object.assign({}, block.data), { childrenIds: filterChildrenIds(block.data.childrenIds) }) });
                    break;
                case 'Container':
                    nDocument[id] = Object.assign(Object.assign({}, block), { data: Object.assign(Object.assign({}, block.data), { props: Object.assign(Object.assign({}, block.data.props), { childrenIds: filterChildrenIds((_a = block.data.props) === null || _a === void 0 ? void 0 : _a.childrenIds) }) }) });
                    break;
                case 'ColumnsContainer':
                    nDocument[id] = {
                        type: 'ColumnsContainer',
                        data: {
                            style: block.data.style,
                            props: Object.assign(Object.assign({}, block.data.props), { columns: (_c = (_b = block.data.props) === null || _b === void 0 ? void 0 : _b.columns) === null || _c === void 0 ? void 0 : _c.map((c) => ({
                                    childrenIds: filterChildrenIds(c.childrenIds),
                                })) }),
                        },
                    };
                    break;
                default:
                    nDocument[id] = block;
            }
        }
        delete nDocument[blockId];
        resetDocument(nDocument);
    };
    return (React.createElement(Paper, { style: STYLE, onClick: (ev) => ev.stopPropagation() },
        React.createElement(Stack, null,
            React.createElement(Tooltip, { title: "Delete", placement: "left-start" },
                React.createElement(IconButton, { onClick: handleDeleteClick, sx: { color: 'text.primary' } },
                    React.createElement(DeleteOutlined, { fontSize: "small" }))))));
}
//# sourceMappingURL=TuneMenu.js.map