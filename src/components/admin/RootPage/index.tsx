import React from "react";

interface RootPageProps {
    segment: string;
    config: Record<string, any>;
}

const RootPage: React.FC<RootPageProps> = ({ segment, config }) => {
    console.log(segment, config);

    return (
        <div className="p-8 text-center text-red-500">
            Admin page not found for segment: <strong>{segment}</strong>
        </div>);
};

export default RootPage;