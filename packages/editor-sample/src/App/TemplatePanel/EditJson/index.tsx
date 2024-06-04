import React, { useState, useMemo, useEffect } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { BorderColorSharp } from '@mui/icons-material';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useDocument, useNotification } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { AES, enc } from 'crypto-js';

// Define the validation schema
const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  text_content: z.string().optional(),
  subject: z.string().min(1, { message: 'Subject is required' }),
});

export default function EditJson({ id }: { id: number }) {
  const notification = useNotification();
  useEffect(() => {
    setFormValues({
      title: notification?.title || '',
      text_content: notification?.text_content || '',
      subject: notification?.subject || '',
    });
  }, [notification]);
  const doc = useDocument();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    title: notification?.title || '',
    text_content: notification?.text_content || '',
    subject: notification?.subject || '',
  });
  const [errors, setErrors] = useState({});
  const url = new URL(window.location.href);
  const hash = url.hash.slice(1); // remove the leading '#'
  const [path, queryParams] = hash.split('?'); // split by '?'
  const parts = path.split('/'); // split by '/'
  const hashParams = new URLSearchParams(queryParams);
  const token = hashParams.get('token');
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  let decryptedMessage: string | undefined;
  if (token) {
    const decodedToken = decodeURIComponent(token);
    const decryptedBytes = AES.decrypt(decodedToken, secretKey);
    const decryptedString = decryptedBytes.toString(enc.Utf8);
    const decryptedObject = JSON.parse(decryptedString);
    decryptedMessage = decryptedObject.token;
  }
  const editNotificationMutation = useMutation({
    mutationFn: (newNotification: any) => {
      fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${decryptedMessage}`,
        },
        body: JSON.stringify(newNotification),
      }).then((response: Response) => {
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
    } catch (error: any) {
      const zodErrors = error.errors.reduce((acc: any, curr: any) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(zodErrors);
    }
  };

  const handleChange = (event: any) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <Tooltip title="Edit this template">
        <IconButton onClick={handleOpen}>
          <BorderColorSharp fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formValues.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            margin="dense"
            name="text_content"
            label="Text Content"
            type="text"
            fullWidth
            value={formValues.text_content}
            onChange={handleChange}
            error={!!errors.text_content}
            helperText={errors.text_content}
          />
          <TextField
            margin="dense"
            name="subject"
            label="Subject"
            type="text"
            fullWidth
            value={formValues.subject}
            onChange={handleChange}
            error={!!errors.subject}
            helperText={errors.subject}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
