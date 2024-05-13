import React, { useEffect } from 'react';
import { useFetchNotification } from './hook/useFetchNotification';
import { TEditorConfiguration } from '../../documents/editor/core';

export default function Test() {
  const { data } = useFetchNotification('1');

  useEffect(() => {
    console.log(data);
  }, [data]);
  console.log(data);
  const EMPTY_EMAIL_MESSAGE: TEditorConfiguration = {
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

  return EMPTY_EMAIL_MESSAGE;
}