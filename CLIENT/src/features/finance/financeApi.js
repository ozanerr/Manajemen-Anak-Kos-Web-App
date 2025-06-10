import { rootApi } from "../api/rootApi";

export const financeApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchFinance: builder.query({
            query: (uid) => ({
                url: `finance/${uid}/getFinance`,
            }),
            providesTags: ["FINANCE"],
        }),
        deleteFinance: builder.mutation({
            query: ({ uid, financeId }) => ({
                url: `finance/${uid}/${financeId}/deleteFinance`,
                method: "DELETE",
            }),
            invalidatesTags: ["FINANCE"],
        }),
        editFinance: builder.mutation({
            query: ({ uid, financeId, data }) => ({
                url: `finance/${uid}/${financeId}/editFinance`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["FINANCE"],
        }),
        createFinance: builder.mutation({
            query: ({ uid, data }) => ({
                url: `finance/${uid}/createFinance`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FINANCE"],
        }),
    }),
});

export const {
    useFetchFinanceQuery,
    useDeleteFinanceMutation,
    useEditFinanceMutation,
    useCreateFinanceMutation,
} = financeApi;
