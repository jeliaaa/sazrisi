import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import Loader from "./reusables/Loader";
import { Navigate } from "react-router-dom";

function SafeRoute({ children }: { children: React.ReactNode }) {
    const { user, getCurrentUser, loading } = useAuthStore();

    const isAuth = !!user;

    useEffect(() => {
        if (!user && !loading) {
            getCurrentUser();
        }
    }, [user, loading, getCurrentUser]);
    console.log(user);

    if (loading) return <Loader />;
    if (!isAuth) return <Navigate to="/login" replace />;

    return <>{children}</>;
}

export default SafeRoute;
