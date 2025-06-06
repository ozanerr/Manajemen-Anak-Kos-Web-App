export const SkeletonItem = () => (
    <div className="flex items-center gap-4">
        <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);
