var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useQuery } from "@tanstack/react-query";
const fetchNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
});
export const useFetchNotification = (id) => {
    return useQuery({ queryKey: ['notification', id], queryFn: () => fetchNotification(id) });
    // const { data, isLoading, isError } = useQuery<Notification>({ queryKey: ['notification', id], queryFn: () => fetchNotification(id) });
};
//# sourceMappingURL=useFetchNotification.js.map