import AdminSettings from "../components/AdminSettings";
import ForgotPassword from "../components/ForgotPassword";
import HomePage from "../components/HomePage";
import LinkedInLoginButton from "../components/LinkedInLoginButton";
import LoginCallback from "../components/LoginCallback";
import Mainlogin from "../components/Mainlogin";
import PasswordReset from "../components/PasswordReset";
import Settings from "../components/Settings";
import Signup from "../components/Signup";
import SupportPage from "../components/SupportPage";
import UserProfile from "../components/UserProfile";

export const routes = [
  {
    key: "home",
    path: "/",
    element: HomePage,
  },
  {
    key: "signup",
    path: "/signup",
    element: Signup,
  },
  {
    key: "mainlogin",
    path: "/mainlogin",
    element: Mainlogin,
  },
  {
    key: "login",
    path: "/login",
    element: LinkedInLoginButton,
  },
  {
    key: "login-callback",
    path: "/login/callback",
    element: LoginCallback,
  },
  {
    key: "profile",
    path: "/profile",
    element: UserProfile,
  },
  {
    key: "settings",
    path: "/settings",
    element: Settings,
  },
  {
    key: "password-reset",
    path: "/password-reset",
    element: PasswordReset,
  },
  {
    key: "request-new-password",
    path: "/request-new-password",
    element: ForgotPassword,
  },
  {
    key: "admin-settings",
    path: "/admin-settings",
    element: AdminSettings,
  },
  {
    key: "support",
    path: "/support",
    element: SupportPage,
  },
];
