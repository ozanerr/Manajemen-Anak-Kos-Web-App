import { data } from "react-router-dom";
import { rootApi } from "../api/rootApi";

export const deadlinesApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchDeadlines: builder.query({
            query: (uid) => ({
                url: `deadline/${uid}/getDeadlines`,
                method: "GET",
            }),
            providesTags: ["DEADLINE"],
        }),
        createDeadline: builder.mutation({
            query: ({ uid, data }) => ({
                url: `deadline/${uid}/createDeadline`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["DEADLINE"],
        }),
        deleteDeadline: builder.mutation({
            query: ({ uid, deadlinesId }) => ({
                url: `deadline/${uid}/${deadlinesId}/deleteDeadline`,
                method: "DELETE",
            }),
            invalidatesTags: ["DEADLINE"],
        }),
        editDeadline: builder.mutation({
            query: ({ uid, deadlinesId, data }) => ({
                url: `deadline/${uid}/${deadlinesId}/editDeadline`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["DEADLINE"],
        }),
    }),
});

export const {
    useCreateDeadlineMutation,
    useFetchDeadlinesQuery,
    useDeleteDeadlineMutation,
    useEditDeadlineMutation,
} = deadlinesApi;
