import { TEditorConfiguration } from "../../documents/editor/core";
type Notification = {
    id: number;
    title: string;
    html_content: string;
    text_content: string;
    json_content: string;
    subject: string;
};
export default function MyTemplate({ template }: {
    template: Notification;
}): TEditorConfiguration;
export {};
//# sourceMappingURL=edit-template.d.ts.map