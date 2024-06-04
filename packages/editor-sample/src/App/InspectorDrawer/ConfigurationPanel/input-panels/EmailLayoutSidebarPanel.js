import React, { useState } from 'react';
import EmailLayoutPropsSchema from '../../../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import { NullableFontFamily } from './helpers/inputs/FontFamily';
export default function EmailLayoutSidebarFields({ data, setData }) {
    var _a, _b, _c;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = EmailLayoutPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    return (React.createElement(BaseSidebarPanel, { title: "Global" },
        React.createElement(ColorInput, { label: "Backdrop color", defaultValue: (_a = data.backdropColor) !== null && _a !== void 0 ? _a : '#F5F5F5', onChange: (backdropColor) => updateData(Object.assign(Object.assign({}, data), { backdropColor })) }),
        React.createElement(ColorInput, { label: "Canvas color", defaultValue: (_b = data.canvasColor) !== null && _b !== void 0 ? _b : '#FFFFFF', onChange: (canvasColor) => updateData(Object.assign(Object.assign({}, data), { canvasColor })) }),
        React.createElement(NullableFontFamily, { label: "Font family", defaultValue: "MODERN_SANS", onChange: (fontFamily) => updateData(Object.assign(Object.assign({}, data), { fontFamily })) }),
        React.createElement(ColorInput, { label: "Text color", defaultValue: (_c = data.textColor) !== null && _c !== void 0 ? _c : '#262626', onChange: (textColor) => updateData(Object.assign(Object.assign({}, data), { textColor })) })));
}
//# sourceMappingURL=EmailLayoutSidebarPanel.js.map