import React, { useEffect, useState } from "react";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";

interface Adventure {
    date: string;
    title: string;
    description: string;
    challenges: string[];
  }
  
const Adventures : React.FC = () => {

    const [adventures, setAdventures] = useState<Adventure[]>([]);

    const fetchAdventures = async() => {
        try {
            const response = await requestApi({
                route: "/adventures/",
                method: requestMethods.GET
            });

            if (response && response.adventures){
                setAdventures(response.adventures);
                console.log(response.adventures);
            }
            else{
                toast.error("Failed to retrieve adventures", response.message);
            }
        } catch (error) {
            console.log("Something wents wrong", error);
        }
    };

    useEffect(() => {
        fetchAdventures();
    }, [])
    return(
        <div></div>
    );
};

export default Adventures;