import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl:
            "https://manajemen-anak-kos-web-app-service-607494574887.asia-southeast1.run.app/api",
    }),
    endpoints: (builder) => ({}),
    tagTypes: ["POST", "COMMENT", "REPLY", "DEADLINE", "FINANCE"],
});
