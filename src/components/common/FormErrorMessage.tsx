import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorMessageProps {
  message: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
    return (
        <div className="flex items-center space-x-1 mt-1 group animate-fadeIn">
            <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
            <p className="text-left text-[11px] text-red-500 font-medium">{message}</p>
        </div>
    );
};

export default FormErrorMessage;