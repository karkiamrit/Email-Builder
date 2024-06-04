export default function MyTemplate({ template }) {
    let EDIT_TEMPLATE;
    if (template) {
        EDIT_TEMPLATE = JSON.parse(template.json_content);
    }
    else {
        EDIT_TEMPLATE = {
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
    }
    return EDIT_TEMPLATE;
}
;
//# sourceMappingURL=edit-template.js.map