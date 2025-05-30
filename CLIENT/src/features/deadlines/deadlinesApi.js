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
    }),
});
