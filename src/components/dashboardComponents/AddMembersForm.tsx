import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AvatarSelector from "../AvatarSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, TAddMember } from "../../libs/types/addMemberTypes";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import Selects, {components} from 'react-select';
import { customStyles, interestOptions } from "../../libs/constants";

const DropdownIndicator = (props: any) => {
    return (
        <components.DropdownIndicator {...props}>
            <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M5 7L10 12L15 7"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </svg>
        </components.DropdownIndicator>
    );
};  

const AddMembersForm : React.FC = () => {

    const [tab, setTab] = useState<string>("Child");
    const [gender, setGender] = useState<'female' | 'male'>('female')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<TAddMember>({
        resolver: zodResolver(addMemberSchema),
    });

    const selectedDate = watch("birthday");

    const onDateSelect = (date: Date | undefined) => {
        setValue("birthday", date || new Date("1900-01-01"), { shouldValidate: true });
    };
    
    return(
        <div className="max-w-2xl w-full backdrop-blur-sm p-6 space-y-6 rounded-2xl">
            {/* Header */}
            <h1 className="text-xl md:text-2xl font-bold font-comic">
                Add Your Loved Ones to Begin the Adventure!
            </h1>

            <Tabs defaultValue="Child" className="w-full" value={tab} onValueChange={(value) => setTab(value)}>
                <div className="flex justify-start items-center pl-20">
                    <TabsList className="flex flex-nowrap space-x-2 bg-[#CDE7FE]">
                        <TabsTrigger value="Child" className="shrink-0">Child</TabsTrigger>
                        <TabsTrigger value="Parent" className="shrink-0">Parent</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value={tab} className="flex flex-col justify-center items-center space-y-5">
                    {/* Avatar Selection */}
                    <div className="mt-10">
                        <h4 className="mb-2 text-xs font-medium -mx-[30px] text-left">Choose your {tab}'s avatar</h4>
                        <div className="flex">
                            <AvatarSelector
                                selectedAvatar={watch("avatar")}
                                onAvatarClick={(src) => setValue("avatar", src, { shouldValidate: true })}
                                role="parent"
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-md">
                        <label htmlFor="username" className="block text-xs font-medium text-gray-700 text-left mb-1">
                            {tab}'s Nickname
                        </label>
                        <div className="relative">
                            <Input
                                {...register("name", { required: true })}
                                id="name" 
                                type="text" 
                                placeholder="nickname" 
                                className="flex-1 h-9 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sn pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] max-w-md" 
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                    <circle cx="12" cy="8" r="5"/>
                                    <path d="M20 21a8 8 0 0 0-16 0"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Birthday Picker */}
                    <div className="w-full max-w-md">
                        <div className="block text-xs font-medium text-gray-700 text-left mb-1">
                            {tab}'s Birthday
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 pr-3 mt-1 placeholder:text-xs placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs flex justify-between items-center font-normal font-poppins",
                                            !selectedDate && "text-gray-500"
                                        )}
                                        style={{ backgroundColor: "transparent" }}
                                        type="button"
                                    >
                                        {selectedDate ? (
                                            format(selectedDate, "PPP")
                                        ) : (
                                            <span className="text-gray-500 font-normal text-xs">
                                                Pick a date
                                            </span>
                                        )}
                                        <CalendarIcon className="ml-auto w-2 h-2 opacity-60 text-gray-500" />
                                    </Button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 justify-center bg-white z-50 shadow-md rounded-md"
                                style={{ pointerEvents: "auto" }} // Ensure it captures interaction
                            >
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={onDateSelect}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    className="rounded-md justify-center items-center bg-white"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Select gender */}
                    <div className="flex rounded-full overflow-hidden w-full max-w-md">
                        <Button
                            type="button"
                            variant={gender === 'female' ? 'default' : 'outline'}
                            className={cn(
                            "flex-1 rounded-none",
                            gender === 'female' ? "bg-[#FF4A90] hover:bg-[#f14687]" : ""
                            )}
                            onClick={() => setGender('female')}
                        >
                            Female
                        </Button>
                        <Button
                            type="button"
                            variant={gender === 'male' ? 'default' : 'outline'}
                            className={cn(
                            "flex-1 rounded-none",
                            gender === 'male' ? "bg-[#3A8EBA] hover:bg-[#347ea5]" : ""
                            )}
                            onClick={() => setGender('male')}
                        >
                            Male
                        </Button>
                    </div>

                    <div className="w-full max-w-md">
                        <label className="block text-xs font-medium text-gray-700 text-left mb-2">{tab}'s Interests</label>
                        <div>
                            <Selects
                                name="interests"
                                isMulti
                                options={interestOptions}
                                placeholder="Select interests..."
                                className="custom-select text-[20px]"
                                classNamePrefix="react-select text-[20px]"
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                    setValue("interests", selectedValues, { shouldValidate: true });
                                }}
                                styles={{
                                    ...customStyles,
                                    option: (provided: any, state: any) => ({
                                        ...provided,
                                        fontSize: '12px',
                                        backgroundColor: state.isFocused ? '#3A8EBA' : provided.backgroundColor,
                                        color: state.isFocused ? 'white' : provided.color,
                                    }),
                                }}
                                components={{ DropdownIndicator }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                menuShouldScrollIntoView={false}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-evenly pt-4">
                        <Button variant="outline" className="flex-1 rounded-full mr-20">
                            Add Another Child
                        </Button>
                        <Button className="flex-1 bg-[#3A8EBA] hover:bg-[#347ea5] rounded-full">
                            Save and Continue
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AddMembersForm;