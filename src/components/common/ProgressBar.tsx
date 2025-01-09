import React from "react";

type ProgressBarProps = {
  completed: number;
  total: number;
  label?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, label }) => {
    // Calculate percentage
    const percentage = (completed / total) * 100;

    // Determine color based on percentage
    const getColor = () => {
        if (percentage < 30) return "bg-[#D90400]";
        if (percentage < 60) return "bg-[#F17A02]";
        return "bg-[#028E4D]";
    };

    return (
        <div className="pt-5">
            <div className="flex justify-between">
                {label && <p className="text-xs">{label}</p>}
                {total === 0 ? (
                    <p className="text-xs">0/0</p>
                ) :
                    <p className="text-xs">{`${completed}/${total}`}</p>
                }
            </div>
            <div className="w-full bg-white rounded-full h-2 mt-3">
                <div
                    className={`h-2 rounded-full ${getColor()}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
