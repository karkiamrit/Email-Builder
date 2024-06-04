var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'zustand';
import getConfiguration from '../../getConfiguration';
import { AES, enc } from 'crypto-js';
// const editorStateStore = create<TValue>(() => ({
//   document: getConfiguration(window.location.hash, data),
//   selectedBlockId: null,
//   selectedSidebarTab: 'styles',
//   selectedMainTab: 'editor',
//   selectedScreenSize: 'desktop',
//   inspectorDrawerOpen: true,
//   samplesDrawerOpen: true,
// }));
export function fetchNotification() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(window.location.href);
        const hash = url.hash.slice(1); // remove the leading '#'
        const [path, queryParams] = hash.split('?'); // split by '?'
        const parts = path.split('/'); // split by '/'
        const id = parts[parts.length - 1]; // take the last part
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
        const res = yield fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}`, {
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
    });
}
const newHash = window.location.hash;
const finalHash = newHash.split('?')[0];
const editorStateStore = create(() => ({
    document: getConfiguration(finalHash),
    selectedBlockId: null,
    notification: null,
    selectedSidebarTab: 'styles',
    selectedMainTab: 'editor',
    selectedScreenSize: 'desktop',
    inspectorDrawerOpen: true,
    samplesDrawerOpen: true,
}));
export function fetchAndSetNotification() {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        let document;
        if (window.location.hash.startsWith('#sample/edit-template')) {
            data = yield fetchNotification();
            document = getConfiguration(finalHash, data);
        }
        else {
            document = getConfiguration(finalHash);
        }
        editorStateStore.setState({ document, notification: data });
    });
}
// Call the function somewhere in your application
fetchAndSetNotification();
export function useDocument() {
    return editorStateStore((s) => s.document);
}
export function useNotification() {
    return editorStateStore((s) => s.notification);
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
export function setSelectedMainTab(selectedMainTab) {
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
export function setSelectedBlockId(selectedBlockId) {
    const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
    const options = {};
    if (selectedBlockId !== null) {
        options.inspectorDrawerOpen = true;
    }
    return editorStateStore.setState(Object.assign({ selectedBlockId,
        selectedSidebarTab }, options));
}
export function setSidebarTab(selectedSidebarTab) {
    return editorStateStore.setState({ selectedSidebarTab });
}
export function resetDocument(document) {
    return editorStateStore.setState({
        document,
        selectedSidebarTab: 'styles',
        selectedBlockId: null,
    });
}
export function setDocument(document) {
    const originalDocument = editorStateStore.getState().document;
    return editorStateStore.setState({
        document: Object.assign(Object.assign({}, originalDocument), document),
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
export function setSelectedScreenSize(selectedScreenSize) {
    return editorStateStore.setState({ selectedScreenSize });
}
//# sourceMappingURL=EditorContext.js.map