import React from "react";
import logo from '/assets/logo/GuardianGrove_logo_Text.png';
import sunImage from '/assets/images/sun.png';
import branchImage1 from '/assets/images/branch1.png';
import balloonImage from '/assets/images/balloon.png';
import "../../styles/addMember.css";

interface AddMembersQuestionProps {
    ChildComponent: React.ComponentType; 
}

const AddMembersBackground: React.FC<AddMembersQuestionProps> = ({ ChildComponent }) => {

    return(
        <div className="addMembers h-screen bg-[#F5F1FA] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Logo */}
            <div className="absolute top-10 left-12">
                <img
                    src={logo}
                    alt="Guardian Grove Logo"
                    width={120}
                    height={120}
                />
            </div>

            <div className="max-w-2xl w-full backdrop-blur-sm p-6 space-y-6 rounded-2xl">
                <ChildComponent />
            </div>

            {/* Decorative Elements */}
            <div className="absolute left-48 top-[26%]">
                <img
                    src={sunImage}
                    alt="Decorative element"
                    width={60}
                    height={60}
                    className="animate-float z-50"
                />
            </div>
            <div className="absolute -left-0.5 bottom-1/4">
                <img
                    src={branchImage1}
                    alt="Decorative element"
                    width={80}
                    height={80}
                    className="animate-float-delayed z-50"
                />
            </div>

            <div className="absolute -right-0.5 top-1/4">
                <img
                    src={branchImage1}
                    alt="Decorative element"
                    width={80}
                    height={80}
                    className="animate-float-delayed rotate-180"
                />
            </div>

            <div className="absolute right-48 bottom-1/3">
                <img
                    src={balloonImage}
                    alt="Decorative element"
                    width={60}
                    height={60}
                    className="animate-float"
                />
            </div>

            {/* Clouds decorations */}
            <div className="absolute top-0 left-0">
                <svg width="210" height="109" viewBox="0 0 210 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_299_3449)">
                        <path opacity="0.1" d="M91.411 -61H-274C-267.024 -15.42 -227.836 19.483 -180.237 19.483C-168.131 19.483 -156.437 17.225 -145.767 12.913C-132.843 67.937 -83.602 109 -24.512 109C32.936 109 81.151 69.99 95.513 17.225C102.32 18.719 109.267 19.476 116.236 19.483C163.631 19.483 203.024 -15.42 210 -61H91.411Z" fill="#C16E6E"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_299_3449">
                            <rect width="420" height="170" fill="white" transform="translate(-210 -61)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className="absolute -top-1 left-[40%]">
                <svg width="302" height="77" viewBox="0 0 302 77" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_299_3453)">
                        <path opacity="0.1" d="M228.004 -29H0C4.353 -0.58 28.805 21.184 58.505 21.184C66.058 21.184 73.355 19.775 80.013 17.087C88.078 51.397 118.803 77 155.673 77C191.518 77 221.603 52.676 230.565 19.775C234.812 20.707 239.147 21.1793 243.495 21.184C273.067 21.184 297.647 -0.58 302 -29H228.004Z" fill="#C16E6E"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_299_3453">
                            <rect width="302" height="106" fill="white" transform="translate(0 -29)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className="absolute top-0 right-0">
                <svg width="169" height="109" viewBox="0 0 169 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_299_3451)">
                        <path opacity="0.1" d="M301.411 -61L-64 -61C-57.024 -15.42 -17.836 19.483 29.763 19.483C41.869 19.483 53.563 17.225 64.233 12.913C77.157 67.937 126.398 109 185.488 109C242.936 109 291.151 69.99 305.513 17.225C312.32 18.719 319.267 19.476 326.236 19.483C373.631 19.483 413.024 -15.42 420 -61L301.411 -61Z" fill="#C16E6E"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_299_3451">
                            <rect width="420" height="170" fill="white" transform="translate(0 -61)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className="absolute bottom-0 left-0">
                <svg width="254" height="132" viewBox="0 0 254 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_299_3455)">
                        <path opacity="0.1" d="M157.953 138H-138C-132.35 101 -100.611 72.667 -62.06 72.667C-52.255 72.667 -42.783 74.5 -34.142 78C-23.674 33.333 16.208 0 64.065 0C110.593 0 149.644 31.667 161.276 74.5C166.788 73.2872 172.415 72.6727 178.059 72.667C216.445 72.667 248.35 101 254 138H157.953Z" fill="#C16E6E"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_299_3455">
                            <rect width="392" height="138" fill="white" transform="translate(-138)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className="absolute bottom-0 right-0">
                <svg width="224" height="132" viewBox="0 0 224 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_299_3457)">
                        <path opacity="0.1" d="M295.953 138H0C5.65 101 37.389 72.667 75.94 72.667C85.745 72.667 95.217 74.5 103.858 78C114.326 33.333 154.208 0 202.065 0C248.593 0 287.644 31.667 299.276 74.5C304.788 73.2872 310.415 72.6727 316.059 72.667C354.445 72.667 386.35 101 392 138H295.953Z" fill="#C16E6E"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_299_3457">
                            <rect width="392" height="138" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    )
};

export default AddMembersBackground;
