import { useQuery } from "@tanstack/react-query";

const fetchNotification = async (id: string) => {
  const res = await fetch(`http://localhost:8003/notifications/${id}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useFetchNotification = (id: string) => {
  return useQuery<Notification>({ queryKey: ['notification', id], queryFn: () => fetchNotification(id) });
    // const { data, isLoading, isError } = useQuery<Notification>({ queryKey: ['notification', id], queryFn: () => fetchNotification(id) });

};