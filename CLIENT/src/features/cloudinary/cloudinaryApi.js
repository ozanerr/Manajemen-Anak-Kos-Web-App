import { rootApi } from "../api/rootApi";

export const cloudinaryApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        getNewUrlPhoto: builder.mutation({
            query: (imageProfile) => ({
                url: `user/getUrl`,
                method: "POST",
                body: imageProfile,
            }),
        }),
    }),
});

export const { useGetNewUrlPhotoMutation } = cloudinaryApi;
