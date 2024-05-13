import { create } from 'zustand';

import getConfiguration from '../../getConfiguration';

import { TEditorConfiguration } from './core';
import { AES, enc } from 'crypto-js';

type TValue = {
  document: TEditorConfiguration;

  selectedBlockId: string | null;
  selectedSidebarTab: 'block-configuration' | 'styles';
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';

  inspectorDrawerOpen: boolean;
  samplesDrawerOpen: boolean;
};

// const editorStateStore = create<TValue>(() => ({
//   document: getConfiguration(window.location.hash, data),
//   selectedBlockId: null,
//   selectedSidebarTab: 'styles',
//   selectedMainTab: 'editor',
//   selectedScreenSize: 'desktop',

//   inspectorDrawerOpen: true,
//   samplesDrawerOpen: true,
// }));

export async function fetchNotification() {
  const url = new URL(window.location.href);
  const hash = url.hash.slice(1); // remove the leading '#'
  const [path, queryParams] = hash.split('?'); // split by '?'
  const parts = path.split('/'); // split by '/'
  const id = parts[parts.length - 1]; // take the last part
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

  const res = await fetch(`http://localhost:8003/notifications/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${decryptedMessage}`,
    },
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}
const newHash = window.location.hash;
const finalHash = newHash.split('?')[0];
const editorStateStore = create<TValue>(() => ({
  document: getConfiguration(finalHash),
  selectedBlockId: null,
  selectedSidebarTab: 'styles',
  selectedMainTab: 'editor',
  selectedScreenSize: 'desktop',

  inspectorDrawerOpen: true,
  samplesDrawerOpen: true,
}));

export async function fetchAndSetNotification() {
  let data;
  let document;
  if (window.location.hash.startsWith('#sample/edit-template')) {
    data = await fetchNotification();

    document = getConfiguration(finalHash, data);
  } else {
    document = getConfiguration(finalHash);
  }

  editorStateStore.setState({ document });
}

// Call the function somewhere in your application
fetchAndSetNotification();

export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
  return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen() {
  return editorStateStore((s) => s.samplesDrawerOpen);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
  const options: Partial<TValue> = {};
  if (selectedBlockId !== null) {
    options.inspectorDrawerOpen = true;
  }
  return editorStateStore.setState({
    selectedBlockId,
    selectedSidebarTab,
    ...options,
  });
}

export function setSidebarTab(selectedSidebarTab: TValue['selectedSidebarTab']) {
  return editorStateStore.setState({ selectedSidebarTab });
}

export function resetDocument(document: TValue['document']) {
  return editorStateStore.setState({
    document,
    selectedSidebarTab: 'styles',
    selectedBlockId: null,
  });
}

export function setDocument(document: TValue['document']) {
  const originalDocument = editorStateStore.getState().document;
  return editorStateStore.setState({
    document: {
      ...originalDocument,
      ...document,
    },
  });
}

export function toggleInspectorDrawerOpen() {
  const inspectorDrawerOpen = !editorStateStore.getState().inspectorDrawerOpen;
  return editorStateStore.setState({ inspectorDrawerOpen });
}

export function toggleSamplesDrawerOpen() {
  const samplesDrawerOpen = !editorStateStore.getState().samplesDrawerOpen;
  return editorStateStore.setState({ samplesDrawerOpen });
}

export function setSelectedScreenSize(selectedScreenSize: TValue['selectedScreenSize']) {
  return editorStateStore.setState({ selectedScreenSize });
}
