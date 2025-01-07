import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface StoreItemProps {
    name: string
    price: number
    image: string
    purchased?: boolean
}
  
const storeItem : React.FC<StoreItemProps> = ({name, price, image, purchased}) => {
    return(
        <Card>
            <CardContent>
                <div>
                    <img src={image} alt="" />
                </div>
                <h4>{name}</h4>
                <div>
                    <img src="" alt="" />
                    <span>{price}</span>
                </div>
                <Button
                    disabled={purchased}
                >
                    {purchased ? "Purchased" : "Buy Now"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default storeItem;