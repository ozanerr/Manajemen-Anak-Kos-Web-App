import { rootApi } from "../api/rootApi";

export const financeApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchFinance: builder.query({
            query: () => ({
                url,
                method,
            }),
            providesTags: ["FINANCE"],
        }),
        deleteFinance: builder.mutation({
            query: () => ({
                url,
                method,
            }),
            invalidatesTags: ["FINANCE"],
        }),
        editFinance: builder.mutation({
            query: () => ({
                url,
                method,
                body,
            }),
            invalidatesTags: ["FINANCE"],
        }),
        createFinance: builder.mutation({
            query: () => ({
                url,
                method,
                body,
            }),
            invalidatesTags: ["FINANCE"],
        }),
    }),
});

export const {
    useFetchFinanceQuery,
    useDeleteFinanceMutation,
    useEditFinanceMutation,
} = financeApi;
