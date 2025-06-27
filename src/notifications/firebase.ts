import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBC410mQOyieErF1xa9KEDjJ-9BrPHMtzY",
    authDomain: "guardian-grove-project.firebaseapp.com",
    projectId: "guardian-grove-project",
    storageBucket: "guardian-grove-project.firebasestorage.app",
    messagingSenderId: "703581295514",
    appId: "1:703581295514:web:597c0fd328761630066023",
    measurementId: "G-197BH07BGT"
};

const vapidKey= "BDI2zBDXX50Gwlc70YnDCSVKaMxDY2QU0mgoOT4jlD-tnoBERnVjr126F1_AV-N-8kzJ6rdvuIp_k_5TAywyeDk";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () =>{
    try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);

        if (permission === "granted") {
            const token = await getToken(messaging, { vapidKey });
            console.log("Generated token:", token);
            return token;
        } else{
            console.log("Notification permission denied");
            return null;
        }
    } catch (error) {
        console.error("Error generating token:", error);
        return null;
    }
}