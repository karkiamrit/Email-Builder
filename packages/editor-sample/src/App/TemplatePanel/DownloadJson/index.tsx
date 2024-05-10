// import React, { useMemo } from 'react';

// import { BorderColorSharp, FileDownloadOutlined } from '@mui/icons-material';
// import { IconButton, Tooltip } from '@mui/material';

// import { useDocument } from '../../../documents/editor/EditorContext';
// import axios from 'axios';

// // import {useMutation} from '@tanstack/react-query';

// export default function DownloadJson() {
//   const url = window.location.href;
//   const lastName = url.split("/").pop();

//   const doc = useDocument();
//   const href = useMemo(() => {
//     return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
//   }, [doc]);

//   function jsonToHtml(json:any) {
//     // Convert the JSON object to a string and wrap it in a paragraph tag
//     return `<p>${JSON.stringify(json)}</p>`;
//   }
  
//   const handleDownload = () => {
//     const newNotification = {
//       title: lastName,
//       html_content: jsonToHtml(doc),
//       text_content: 'Notification Text Content',
//       subject: lastName,
//     };
//     console.log(newNotification)
//     axios.post('http://localhost:8003/notifications', newNotification)
//   };
//   return (
//     <Tooltip title="Create this template">
//       <IconButton onClick={handleDownload}>
//         <BorderColorSharp fontSize="small" />
//          <h1 className='text-sm font-light w-10'> Create this Icon</h1>
//       </IconButton>
//     </Tooltip>
//   );
// }

import React, { useMemo } from 'react';

import { BorderColorSharp, FileDownloadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { useMutation } from '@tanstack/react-query';

// import {useMutation} from '@tanstack/react-query';

export default function DownloadJson() {
  const doc = useDocument();
  const href = useMemo(() => {
    return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
  }, [doc]);

  function jsonToHtml(json:any) {
    // Convert the JSON object to a string and wrap it in a paragraph tag
    return `<p>${JSON.stringify(json)}</p>`;
  }
  const createNotificationMutation = useMutation({
    mutationFn: (newNotification: any) => {
      fetch('http://localhost:8003/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      }).then((response: Response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    }}
  );
  const handleCreate = () => {
    const newNotification = {
      title: lastName,
      html_content: jsonToHtml(doc),
      text_content: 'Notification Text Content',
      subject: lastName,
    };
    createNotificationMutation.mutate(newNotification);
  };
  
  console.log(createNotificationMutation.status); // "idle" | "loading" | "error" | "success"
  console.log(createNotificationMutation.error); // Any potential error

  return (
    <Tooltip title="Create this template">
      <IconButton onClick={handleCreate}>
        <BorderColorSharp fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}