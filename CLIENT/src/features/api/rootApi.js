import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "manajemen-anak-kos-web-app-production.up.railway.app/api",
    }),
    endpoints: (builder) => ({}),
    tagTypes: ["POST", "COMMENT", "REPLY", "DEADLINE", "FINANCE"],
});
