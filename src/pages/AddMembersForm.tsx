import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import AvatarSelector from "../components/AvatarSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, TAddMember } from "../libs/types/addMemberTypes";
import { Input } from "../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import Selects, { components, DropdownIndicatorProps, GroupBase, SelectInstance } from 'react-select';
import { customStyles, interestOptions } from "../libs/constants";
import girlImage from "/assets/images/girl.png";
import boyImage from "/assets/images/boy.png";
import { requestApi } from "../libs/requestApi";
import { requestMethods } from "../libs/enum/requestMethods";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import FormErrorMessage from "../components/common/FormErrorMessage";
import { SelectOption } from "../libs/types/SelectOption";

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, true, GroupBase<SelectOption>>) => {
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
    const selectRef = useRef<SelectInstance<SelectOption, true, GroupBase<SelectOption>>>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<TAddMember>({
        resolver: zodResolver(addMemberSchema),
        defaultValues:{
            gender: "female",
            role: "child"
        }
    });

    const resetData = useCallback(() => {
        reset({
            gender: "female", // Reset default values
            role: "child",
            name: "",
            birthday: undefined,
            interests: [],
            avatar: "",
        });
        selectRef.current?.clearValue();
    }, [reset]);

    const selectedDate = watch("birthday");
    const gender = watch("gender"); 
    const navigate = useNavigate();

    const onDateSelect = (date: Date | undefined) => {
        setValue("birthday", date || new Date("1900-01-01"), { shouldValidate: true });
    };

    const onSubmit = async (data: TAddMember) => {
        console.log(data);
        try {
            // Minimal data for submission
            const formData = new FormData();

            formData.append('gender', data.gender || 'female');
            formData.append('role', data.role || tab.toLowerCase());
            formData.append('name', data.name || '');
            formData.append('birthday', data.birthday ? data.birthday.toISOString() : '');
            formData.append('interests', JSON.stringify(data.interests || []));
            
            if (data.avatar && data.avatar.startsWith('blob:')) {
                try {
                    const blobResponse = await fetch(data.avatar);
                    const avatarBlob = await blobResponse.blob();
                    formData.append('avatar', avatarBlob, 'avatar.png');
                } catch (blobError) {
                    console.error('Error converting blob to file:', blobError);
                    toast.error('Error processing avatar image');
                    return false;
                }
            } else if (data.avatar) {
                // If it's already a file or other format
                formData.append('avatar', data.avatar);
            }

            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const result = await requestApi({
                route: "/users/",
                method: requestMethods.POST,
                body: formData,
            });
            if (result) {
                console.log(result.user);
                // Success Toast
                toast.success(`Create your ${tab} successful, check your email.`);
                return true;
            }
        } catch (error) {
            console.log("Something wrong happened", error);
            toast.error(`There was an error creating the ${tab}. Please try again.`);
            return false; 
        }
    };

    useEffect(() => {
        reset({
            gender: "female", // Reset default values
            name: "",
            birthday: undefined,
            interests: [],
            avatar: "",
        });
        selectRef.current?.clearValue();
        setValue("role", tab.toLowerCase(), { shouldValidate: true });
    }, [tab, setValue, reset]);
    
    return(
        <>
            <ToastContainer className="text-xs"/>
            {/* Header */}
            <h1 className="text-xl md:text-2xl font-bold font-comic">
                Add Your Loved Ones to Begin the Adventure!
            </h1>

            <Tabs defaultValue="Child" className="w-full" value={tab} 
                onValueChange={(value) => {
                    setTab(value);
                    setValue("role", value.toLowerCase(), { shouldValidate: true });
                }}
            >
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
                                role={tab.toLocaleLowerCase()}
                            />
                        </div>
                        {errors.avatar && <FormErrorMessage message={errors.avatar.message as string}/>}
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
                        {errors.name && <FormErrorMessage message={errors.name.message as string}/>}
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
                        {errors.birthday && <FormErrorMessage message={errors.birthday.message as string}/>}
                    </div>

                    {/* Select gender */}
                    <div className="flex rounded-full overflow-hidden w-full max-w-md">
                        <Button
                            type="button"
                            variant={gender === 'female' ? 'default' : 'outline'}
                            className={cn(
                            "flex-1 rounded-none gap-6",
                            gender === 'female' ? "bg-[#FF4A90] hover:bg-[#f14687]" : ""
                            )}
                            onClick={() => setValue("gender", "female", { shouldValidate: true })} 
                        >
                            <img src={girlImage} alt="female" className="w-6 h-6"/>
                            <span>Female</span>
                        </Button>
                        <Button
                            type="button"
                            variant={gender === 'male' ? 'default' : 'outline'}
                            className={cn(
                            "flex-1 rounded-none gap-6",
                            gender === 'male' ? "bg-[#3A8EBA] hover:bg-[#347ea5]" : ""
                            )}
                            onClick={() => setValue("gender", "male", { shouldValidate: true })} 
                        >
                            <img src={boyImage} alt="boy" className="w-6 h-6"/>
                            <span>Male</span>
                        </Button>
                    </div>
                    {errors.gender && <FormErrorMessage message={errors.gender.message as string}/>}

                    <div className="w-full max-w-md">
                        <label className="block text-xs font-medium text-gray-700 text-left mb-2">{tab}'s Interests</label>
                        <div>
                            <Selects
                                ref={selectRef}
                                name="interests"
                                isMulti
                                options={interestOptions}
                                placeholder="Select interests..."
                                className="custom-select text-[20px]"
                                classNamePrefix="react-select text-[20px]"
                                onChange={(selectedOptions) => {
                                    const selectedValues = Array.isArray(selectedOptions)
                                        ? selectedOptions.map((option) => (option as SelectOption).value)
                                        : [];
                                    setValue("interests", selectedValues);
                                }}
                                styles={{
                                    ...customStyles,
                                    option: (base, state) => ({
                                        ...base,
                                        fontSize: '12px',
                                        backgroundColor: state.isFocused ? '#3A8EBA' : base.backgroundColor,
                                        color: state.isFocused ? 'white' : base.color,
                                    }),
                                }}
                                components={{ DropdownIndicator }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                menuShouldScrollIntoView={false}
                            />
                        </div>
                        {errors.interests && <FormErrorMessage message={errors.interests.message as string}/>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-evenly pt-4">
                        <Button variant="outline" className="flex-1 rounded-full mr-20" 
                            onClick={handleSubmit(
                                async (data) => {
                                    console.log('Valid submission:', data);
                                    const success = await onSubmit(data);
                                    if (success) resetData();
                                },
                                (errors) => {
                                    console.log('Validation errors:', errors);
                                }
                            )}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-plus">
                                <path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/>
                                <path d="M19 16v6"/>
                                <path d="M22 19h-6"/>
                            </svg>
                            <span>Add Another {tab}</span>
                        </Button>
                        <Button className="flex-1 bg-[#3A8EBA] hover:bg-[#347ea5] rounded-full" 
                                onClick={() => navigate("/dashboard")}
                                type="button"
                        >
                            Save and Continue
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default AddMembersForm;