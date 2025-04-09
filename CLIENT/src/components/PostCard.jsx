import React, { useState } from "react";
import { formatter } from "../assets/date-config";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleEditComment = () => {};
    const handleDeleteComment = () => {};
    const {
        _id,
        title,
        category,
        description,
        image,
        username,
        imageProfile,
        createdAt,
    } = post || {};

    return (
        <div className="mx-auto w-full">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg mb-5 w-full">
                <div className="flex pt-5 pl-5 pr-5 w-full">
                    <div className="flex items-center grow-1">
                        <p className="inline-flex items-center mr-3 text-sm text-black">
                            <img
                                className="mr-2 w-8 h-8 rounded-full"
                                src={imageProfile}
                                alt="User Profile"
                            />
                            {username}
                        </p>
                        <p className="text-sm text-gray-600">
                            <time>{formatter.format(new Date(createdAt))}</time>
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            id="dropdownComment1Button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-200 focus:ring-gray-600"
                        >
                            <svg
                                className="w-5 h-4"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-32 rounded shadow-lg z-10">
                                <button
                                    onClick={handleEditComment}
                                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 w-full text-left"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteComment}
                                    className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-200 w-full text-left"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {image ? (
                    <div className="p-5">
                        <img
                            className="rounded-t-lg h-60 w-full object-cover"
                            src={image}
                            alt=""
                        />
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="px-5 pb-5 mt-3 mb-2">
                    <span className="bg-black text-white text-sm  my-3 px-2 py-1 mb-2 rounded w-full">
                        {category}
                    </span>
                    <a href="#">
                        <h5 className="text-black-900 font-bold text-2xl tracking-tight mb-2">
                            {title}
                        </h5>
                    </a>

                    <p className="font-normal text-gray-700 mb-3 text-justify w-full">
                        {description
                            ? description.substr(0, 300)
                            : "no description on this post"}
                        ...
                    </p>
                    <Link
                        to={`/posts/${_id}`}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                        href="#"
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
