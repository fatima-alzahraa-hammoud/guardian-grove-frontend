import React, { useEffect, useState } from "react";
import Navbar from "../components/common/NavBar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { requestApi } from "../libs/requestApi";
import { requestMethods } from "../libs/enum/requestMethods";

interface DecodedToken {
    userId: string;
    role: string;
}

const Main : React.FC = () => {

    const dispatch = useDispatch();
    const [userId, setUserId] = useState<string | null>(null);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
        
    useEffect(() =>{
        if (token){
            const decoded = jwtDecode<DecodedToken>(token);
            console.log("Decoded token:", decoded); 
            setUserId(decoded.userId);
        }
        else{
            toast.error("You are not allowed to access the page");
            navigate("/");
        }
    }, []);

    useEffect(() =>{
        const fetchUsers = async() =>{
            try{

                const response = await requestApi({
                    route: "/users/user",
                    method: requestMethods.GET,
                    body: userId,
                });

                if (response){
                    dispatch(setUser(response.user));
                }else {
                    toast.error(response.message || 'Getting user failed!');
                }
    
            }catch(error){
                toast.error('An error occurred during getting user.');
            }
        }

        fetchUsers();
    }, [userId]);


    return(
        <div>
            <Navbar />
        </div>
    );
}
export default Main;