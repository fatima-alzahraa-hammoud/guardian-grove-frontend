import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Avatar from "@mui/material/Avatar";

const avatars = [
  { id: 1, src: "src/assets/images/avatars/parent/avatar1.png" },
  { id: 2, src: "src/assets/images/avatars/parent/avatar2.png" },
  { id: 3, src: "src/assets/images/avatars/parent/avatar3.png" },
  { id: 4, src: "src/assets/images/avatars/parent/avatar4.png" },
  { id: 5, src: "src/assets/images/avatars/parent/avatar5.png" },
  { id: 6, src: "src/assets/images/avatars/parent/avatar6.png" },
  { id: 7, src: 'src/assets/images/avatars/parent/avatar7.png' },
  { id: 8, src: 'src/assets/images/avatars/parent/avatar8.png' },
  { id: 9, src: 'src/assets/images/avatars/parent/avatar9.png' },
];

interface AvatarSelectorProps {
  selectedAvatar: number | null;
  onAvatarClick: (id: number) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onAvatarClick }) => {
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-1">
        {avatars.map((avatar) => (
          <CarouselItem key={avatar.id} className="pl-1 md:basis-14 lg:basis-14">
            <Avatar
              alt="avatar"
              src={avatar.src}
              sx={{
                border: selectedAvatar === avatar.id ? '3px solid #1976d2' : '2px solid #ddd',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
              }}
              onClick={() => onAvatarClick(avatar.id)}
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