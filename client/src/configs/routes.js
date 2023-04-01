import ForgotPassword from "../components/ForgotPassword";
import HomePage from "../components/HomePage";
import LinkedInLoginButton from "../components/LinkedInLoginButton";
import LoginCallback from "../components/LoginCallback";
import Mainlogin from "../components/Mainlogin";
import PasswordReset from "../components/PasswordReset";
import Signup from "../components/Signup";
import UserProfile from "../components/UserProfile";

export const routes= [
    {
        path: "/",
        element: HomePage
    }    ,
    {
        path: "/signup",
        element: Signup
    }    ,
    {
        path: "/mainlogin",
        element: Mainlogin
    }    ,
    {
        path: "/login",
        element: LinkedInLoginButton
    }    ,
    {
        path: "/login/callback",
        element: LoginCallback
    }    ,
    {
        path: "/profile",
        element: UserProfile
    }    ,
    {
        path: "/password-reset",
        element: PasswordReset
    }    ,
    {
        path: "/request-new-password",
        element: ForgotPassword
    }    
];
