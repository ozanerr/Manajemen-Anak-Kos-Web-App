import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://aturin-server.vercel.app/api",
    }), 
    endpoints: (builder) => ({}),
    tagTypes: ["POST", "COMMENT", "REPLY", "DEADLINE", "FINANCE"],
});
