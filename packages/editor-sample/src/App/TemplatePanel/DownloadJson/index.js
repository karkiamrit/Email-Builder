// // import React, { useMemo } from 'react';
// // import { BorderColorSharp, FileDownloadOutlined } from '@mui/icons-material';
// // import { IconButton, Tooltip } from '@mui/material';
// // import { useDocument } from '../../../documents/editor/EditorContext';
// // import axios from 'axios';
// // // import {useMutation} from '@tanstack/react-query';
// // export default function DownloadJson() {
// //   const url = window.location.href;
// //   const lastName = url.split("/").pop();
// //   const doc = useDocument();
// //   const href = useMemo(() => {
// //     return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
// //   }, [doc]);
// //   function jsonToHtml(json:any) {
// //     // Convert the JSON object to a string and wrap it in a paragraph tag
// //     return `<p>${JSON.stringify(json)}</p>`;
// //   }
// //   const handleDownload = () => {
// //     const newNotification = {
// //       title: lastName,
// //       html_content: jsonToHtml(doc),
// //       text_content: 'Notification Text Content',
// //       subject: lastName,
// //     };
// //     console.log(newNotification)
// //     axios.post('${import.meta.env.VITE_API_URL}/notifications', newNotification)
// //   };
// //   return (
// //     <Tooltip title="Create this template">
// //       <IconButton onClick={handleDownload}>
// //         <BorderColorSharp fontSize="small" />
// //          <h1 className='text-sm font-light w-10'> Create this Icon</h1>
// //       </IconButton>
// //     </Tooltip>
// //   );
// // }
// import React, { useMemo } from 'react';
// import { BorderColorSharp, FileDownloadOutlined } from '@mui/icons-material';
// import { IconButton, Tooltip } from '@mui/material';
// import { useDocument } from '../../../documents/editor/EditorContext';
// import { useMutation } from '@tanstack/react-query';
// // import {useMutation} from '@tanstack/react-query';
// export default function DownloadJson() {
//   const doc = useDocument();
//   const href = useMemo(() => {
//     return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
//   }, [doc]);
//   function jsonToHtml(json:any) {
//     // Convert the JSON object to a string and wrap it in a paragraph tag
//     return `<p>${JSON.stringify(json)}</p>`;
//   }
//   const createNotificationMutation = useMutation({
//     mutationFn: (newNotification: any) => {
//       fetch('${import.meta.env.VITE_API_URL}/notifications', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newNotification),
//       }).then((response: Response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//     }}
//   );
//   const handleCreate = () => {
//     const newNotification = {
//       title: lastName,
//       html_content: jsonToHtml(doc),
//       text_content: 'Notification Text Content',
//       subject: lastName,
//     };
//     createNotificationMutation.mutate(newNotification);
//   };
//   console.log(createNotificationMutation.status); // "idle" | "loading" | "error" | "success"
//   console.log(createNotificationMutation.error); // Any potential error
//   return (
//     <Tooltip title="Create this template">
//       <IconButton onClick={handleCreate}>
//         <BorderColorSharp fontSize="small" />
//       </IconButton>
//     </Tooltip>
//   );
// }
import React, { useState } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { BorderColorSharp } from '@mui/icons-material';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, } from '@mui/material';
import { useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { AES, enc } from 'crypto-js';
// Define the validation schema
const schema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    text_content: z.string().optional(),
    subject: z.string().min(1, { message: 'Subject is required' }),
});
export default function DownloadJson() {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    console.log(secretKey);
    const doc = useDocument();
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({ title: '', text_content: '', subject: '' });
    const [errors, setErrors] = useState({});
    const url = new URL(window.location.href);
    const hash = url.hash.slice(1); // remove the leading '#'
    let [path, queryParams] = hash.split('?'); // split by '?'
    console.log(path);
    const hashParams = new URLSearchParams(queryParams);
    const token = hashParams.get('token');
    let decryptedMessage = "";
    if (token) {
        const decodedToken = decodeURIComponent(token);
        console.log(decodedToken);
        const decryptedBytes = AES.decrypt(decodedToken, secretKey);
        const decryptedString = decryptedBytes.toString(enc.Utf8);
        try {
            const decryptedObject = JSON.parse(decryptedString);
            decryptedMessage = decryptedObject.token;
        }
        catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
    const createNotificationMutation = useMutation({
        mutationFn: (newNotification) => {
            return fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${decryptedMessage}`,
                },
                body: JSON.stringify(newNotification),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
        },
        onSuccess: (data) => {
            console.log(data);
            window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/dashboard/email-campaign/create?templateId=${data.id}`;
        }
    });
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleCreate = () => {
        try {
            // Validate the form values
            schema.parse(formValues);
            let document = renderToStaticMarkup(doc, { rootBlockId: 'root' });
            const newNotification = {
                title: formValues.title,
                html_content: `${document}`,
                json_content: `${JSON.stringify(doc)}`,
                text_content: formValues.text_content,
                subject: formValues.subject,
            };
            createNotificationMutation.mutate(newNotification);
            handleClose();
        }
        catch (error) {
            const zodErrors = error.errors.reduce((acc, curr) => {
                acc[curr.path[0]] = curr.message;
                return acc;
            }, {});
            setErrors(zodErrors);
        }
    };
    const handleChange = (event) => {
        setFormValues(Object.assign(Object.assign({}, formValues), { [event.target.name]: event.target.value }));
    };
    return (React.createElement("div", null,
        React.createElement(Tooltip, { title: "Create this template" },
            React.createElement(IconButton, { onClick: handleOpen },
                React.createElement(BorderColorSharp, { fontSize: "small" }))),
        React.createElement(Dialog, { open: open, onClose: handleClose },
            React.createElement(DialogTitle, null, "Create Notification"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, margin: "dense", name: "title", label: "Title", type: "text", fullWidth: true, value: formValues.title, onChange: handleChange, error: !!(errors === null || errors === void 0 ? void 0 : errors.title), helperText: errors === null || errors === void 0 ? void 0 : errors.title }),
                React.createElement(TextField, { margin: "dense", name: "text_content", label: "Text Content", type: "text", fullWidth: true, value: formValues.text_content, onChange: handleChange, error: !!(errors === null || errors === void 0 ? void 0 : errors.text_content), helperText: errors === null || errors === void 0 ? void 0 : errors.text_content }),
                React.createElement(TextField, { margin: "dense", name: "subject", label: "Subject", type: "text", fullWidth: true, value: formValues.subject, onChange: handleChange, error: !!(errors === null || errors === void 0 ? void 0 : errors.subject), helperText: errors === null || errors === void 0 ? void 0 : errors.subject })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleClose }, "Cancel"),
                React.createElement(Button, { onClick: handleCreate }, "Create")))));
}
//# sourceMappingURL=index.js.map