import React, { useRef } from "react";
import 'react-day-picker/dist/style.css';
import { Input } from "../../components/ui/input";
import { ChevronDownIcon } from "lucide-react";
import "../styles/global.css";


const SecondSignUpForm: React.FC = () => {

    const dateInputRef = useRef<HTMLInputElement>(null);

    const openDatePicker = () => {
        if (dateInputRef.current) {
          dateInputRef.current.showPicker();
        }
      };

    return (
        <div className="w-full max-w-md space-y-6 -mt-24 font-poppins">
            {/*title*/}
            <div className="form-element text-center flex-col space-y-4">
                <h1 className="text-3xl font-bold text-center text-gray-800 font-comic">Welcome to Guardian Grove!</h1>
                <p className="text-sm text-muted-foreground">
                    Your AI companion for growth, connection, and care.
                </p>
            </div>

            {/*form*/}
            <form className="space-y-4 w-full">
                <div className="mx-10 relative">
                    <label htmlFor="birthday" className="block text-xs font-medium text-gray-700 text-left mb-1">
                        Birthday
                    </label>
                    
                    {/* Custom Date Input */}
                    <div className="relative w-full">
                        <Input
                            ref={dateInputRef}
                            type="date"
                            id="birthday"
                            name="birthday"
                            className="w-full pl-4 pr-10 text-xs text-gray-700 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus:outline-none focus:ring-1 focus:ring-[#3A8EBA] md:text-xs appearance-none cursor-pointer"
                            onClick={openDatePicker}
                        />

                        {/* Custom Icon */}
                        <div onClick={openDatePicker} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar cursor-pointer text-gray-500">
                                <path d="M8 2v4"/><path d="M16 2v4"/>
                                <rect width="18" height="18" x="3" y="4" rx="2"/>
                                <path d="M3 10h18"/>
                            </svg>
                            
                        </div>
                    </div>
                </div>

                {/* Select Gender */}
                <div className="mx-10 relative">
                    <label htmlFor="gender" className="block text-xs font-medium text-gray-700 text-left mb-1">
                        Select Gender
                    </label>
                    <div className="relative w-full">
                        <select
                            id="gender"
                            name="gender"
                            className="w-full h-10 pl-4 pr-10 mt-1 placeholder:text-xs cursor-pointer placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus:outline-none focus:ring-1 focus:ring-[#3A8EBA] md:text-xs custom-select"
                        >
                            <option value="" disabled selected>Select option</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
};

export default SecondSignUpForm;