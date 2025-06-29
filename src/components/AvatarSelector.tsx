import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import {Avatar, AvatarImage} from "./ui/avatar";

const parentAvatars = [
  { id: 1, src: "/assets/images/avatars/parent/avatar1.png" },
  { id: 2, src: "/assets/images/avatars/parent/avatar2.png" },
  { id: 3, src: "/assets/images/avatars/parent/avatar3.png" },
  { id: 4, src: "/assets/images/avatars/parent/avatar4.png" },
  { id: 5, src: "/assets/images/avatars/parent/avatar5.png" },
  { id: 6, src: "/assets/images/avatars/parent/avatar6.png" },
  { id: 7, src: '/assets/images/avatars/parent/avatar7.png' },
  { id: 8, src: '/assets/images/avatars/parent/avatar8.png' },
  { id: 9, src: '/assets/images/avatars/parent/avatar9.png' },
];

const familyAvatars = [
  { id: 1, src: "/assets/images/avatars/family/avatar1.png" },
  { id: 2, src: "/assets/images/avatars/family/avatar2.png" },
  { id: 3, src: "/assets/images/avatars/family/avatar3.png" },
  { id: 4, src: "/assets/images/avatars/family/avatar4.png" },
  { id: 5, src: "/assets/images/avatars/family/avatar5.png" },
  { id: 6, src: "/assets/images/avatars/family/avatar6.png" },
  { id: 7, src: '/assets/images/avatars/family/avatar7.png' },
  { id: 8, src: '/assets/images/avatars/family/avatar8.png' },
  { id: 9, src: '/assets/images/avatars/family/avatar9.png' },
  { id: 10, src: '/assets/images/avatars/family/avatar10.png' },
  { id: 11, src: '/assets/images/avatars/family/avatar11.png' },
];

const childAvatars = [
  { id: 1, src: "/assets/images/avatars/child/avatar1.png" },
  { id: 2, src: "/assets/images/avatars/child/avatar2.png" },
  { id: 3, src: "/assets/images/avatars/child/avatar3.png" },
  { id: 4, src: "/assets/images/avatars/child/avatar4.png" },
  { id: 5, src: "/assets/images/avatars/child/avatar5.png" },
  { id: 6, src: "/assets/images/avatars/child/avatar6.png" },
  { id: 7, src: '/assets/images/avatars/child/avatar7.png' },
  { id: 8, src: '/assets/images/avatars/child/avatar8.png' },
  { id: 9, src: '/assets/images/avatars/child/avatar9.png' },
  { id: 10, src: '/assets/images/avatars/child/avatar10.png' },
];

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onAvatarClick: (src: string) => void;
  role: string | 'parent';
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onAvatarClick, role }) => {
  const [avatars, setAvatars] = useState<{ id: number; src: string }[]>([]);
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (role === "parent") {
      setAvatars(parentAvatars);
    } else if (role === "family"){
      setAvatars(familyAvatars);
    } else if (role === "child") {
      setAvatars(childAvatars);
    }
  }, [role]);

  // Check if current avatar is a custom upload (blob URL)
  const isCurrentAvatarCustomUpload = selectedAvatar && selectedAvatar.startsWith('blob:');
  
  // Check if current avatar is from backend (http/https URL) and not a predefined one
  const isCurrentAvatarFromBackend = selectedAvatar && 
    (selectedAvatar.startsWith('http') || selectedAvatar.startsWith('https://')) && 
    !selectedAvatar.startsWith('/assets/');

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const avatarUrl = URL.createObjectURL(file);
      setUploadedAvatar(avatarUrl);
      onAvatarClick(avatarUrl);
    }
  };

  const handleAvatarClick = (src: string) => {
    // Clear uploaded avatar if selecting a pre-defined one
    if (uploadedAvatar && src !== uploadedAvatar) {
      URL.revokeObjectURL(uploadedAvatar); // Clean up memory
      setUploadedAvatar(null);
    }
    onAvatarClick(src);
  };

  const handleCurrentAvatarClick = () => {
    if (selectedAvatar) {
      onAvatarClick(selectedAvatar);
    }
  };

  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-1">

        {/* Upload slot - always show with + */}
        <CarouselItem className="pl-1 basis-14">
          <label className="cursor-pointer w-10 flex-shrink-0 h-10 flex items-center justify-center rounded-full border-2"
                 style={{
                   borderColor: isCurrentAvatarCustomUpload ? '#1976d2' : '#ddd'
                 }}>
            <input type="file" className="hidden" onChange={handleAvatarUpload} />
            {isCurrentAvatarCustomUpload ? (
              <img
                src={uploadedAvatar || selectedAvatar}
                alt="Uploaded avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-500 text-xl text-center">
                +
              </span>
            )}
          </label>
        </CarouselItem>
        
        {/* Show current avatar from backend if it exists and is not predefined */}
        {isCurrentAvatarFromBackend && (
          <CarouselItem className="pl-1 basis-14">
            <div
              className="cursor-pointer w-10 flex-shrink-0 h-10 flex items-center justify-center rounded-full border-2"
              style={{
                borderColor: selectedAvatar === selectedAvatar ? '#1976d2' : '#ddd'
              }}
              onClick={handleCurrentAvatarClick}
            >
              <img
                src={selectedAvatar}
                alt="Current avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </CarouselItem>
        )}
      
        {/* Predefined avatars */}
        {avatars.map((avatar) => (
          <CarouselItem key={avatar.id} className="pl-1 basis-14">
            <Avatar
              style={{
                border: selectedAvatar === avatar.src ? '3px solid #1976d2' : '2px solid #ddd',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
              }}
            >
              <AvatarImage
                alt="avatar"
                src={avatar.src}
                onClick={() => handleAvatarClick(avatar.src)}
              />
            </Avatar>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="w-5 h-5" />
      <CarouselNext className="w-5 h-5" />
    </Carousel>
  );
};

export default AvatarSelector;