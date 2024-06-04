import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { BorderColorSharp } from '@mui/icons-material';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, } from '@mui/material';
import { useDocument, useNotification } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { AES, enc } from 'crypto-js';
// Define the validation schema
const schema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    text_content: z.string().optional(),
    subject: z.string().min(1, { message: 'Subject is required' }),
});
export default function EditJson({ id }) {
    const notification = useNotification();
    useEffect(() => {
        setFormValues({
            title: (notification === null || notification === void 0 ? void 0 : notification.title) || '',
            text_content: (notification === null || notification === void 0 ? void 0 : notification.text_content) || '',
            subject: (notification === null || notification === void 0 ? void 0 : notification.subject) || '',
        });
    }, [notification]);
    const doc = useDocument();
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        title: (notification === null || notification === void 0 ? void 0 : notification.title) || '',
        text_content: (notification === null || notification === void 0 ? void 0 : notification.text_content) || '',
        subject: (notification === null || notification === void 0 ? void 0 : notification.subject) || '',
    });
    const [errors, setErrors] = useState({});
    const url = new URL(window.location.href);
    const hash = url.hash.slice(1); // remove the leading '#'
    const [path, queryParams] = hash.split('?'); // split by '?'
    const parts = path.split('/'); // split by '/'
    console.log(parts);
    const hashParams = new URLSearchParams(queryParams);
    const token = hashParams.get('token');
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    let decryptedMessage;
    if (token) {
        const decodedToken = decodeURIComponent(token);
        const decryptedBytes = AES.decrypt(decodedToken, secretKey);
        const decryptedString = decryptedBytes.toString(enc.Utf8);
        const decryptedObject = JSON.parse(decryptedString);
        decryptedMessage = decryptedObject.token;
    }
    const editNotificationMutation = useMutation({
        mutationFn: (newNotification) => {
            return fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}`, {
                method: 'PUT',
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
            window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/dashboard/email-campaign/create?templateId=${id}`;
        },
    });
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleEdit = () => {
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
            editNotificationMutation.mutate(newNotification);
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
        React.createElement(Tooltip, { title: "Edit this template" },
            React.createElement(IconButton, { onClick: handleOpen },
                React.createElement(BorderColorSharp, { fontSize: "small" }))),
        React.createElement(Dialog, { open: open, onClose: handleClose },
            React.createElement(DialogTitle, null, "Edit Notification"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, margin: "dense", name: "title", label: "Title", type: "text", fullWidth: true, value: formValues.title, onChange: handleChange, error: !!(errors === null || errors === void 0 ? void 0 : errors.title), helperText: errors === null || errors === void 0 ? void 0 : errors.title }),
                React.createElement(TextField, { margin: "dense", name: "text_content", label: "Text Content", type: "text", fullWidth: true, value: formValues.text_content, onChange: handleChange, error: !!(errors === null || errors === void 0 ? void 0 : errors.text_content), helperText: errors === null || errors === void 0 ? void 0 : errors.text_content }),
                React.createElement(TextField, { margin: "dense", name: "subject", label: "Subject", type: "text", fullWidth: true, value: formValues.subject, onChange: handleChange, error: !!(errors === null || errors === void 0 ? void 0 : errors.subject), helperText: errors === null || errors === void 0 ? void 0 : errors.subject })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleClose }, "Cancel"),
                React.createElement(Button, { onClick: handleEdit }, "Update")))));
}
//# sourceMappingURL=index.js.map