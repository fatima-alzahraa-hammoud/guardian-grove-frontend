import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Avatar from "@mui/material/Avatar";

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

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onAvatarClick: (src: string) => void;
  role: string | 'parent';
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onAvatarClick, role }) => {
  const [avatars, setAvatars] = useState<{ id: number; src: string }[]>([]);

  useEffect(() => {
    if (role === "parent") {
      setAvatars(parentAvatars);
    } else if (role === "family"){
      setAvatars(familyAvatars);
    }
  }, [role]);

  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-1">
        {avatars.map((avatar) => (
          <CarouselItem key={avatar.id} className="pl-1 basis-14">
            <Avatar
              alt="avatar"
              src={avatar.src}
              sx={{
                border: selectedAvatar === avatar.src ? '3px solid #1976d2' : '2px solid #ddd',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
              }}
              onClick={() => onAvatarClick(avatar.src)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="w-5 h-5" />
      <CarouselNext className="w-5 h-5" />
    </Carousel>
  );
};

export default AvatarSelector;