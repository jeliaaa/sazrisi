import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import Loader from "./reusables/Loader";
import { Navigate } from "react-router-dom";

function SafeRoute({ children }: { children: React.ReactNode }) {
    const { user, getCurrentUser, isAuth, loading } = useAuthStore();

    useEffect(() => {
        console.log(isAuth);

    }, [isAuth])
    useEffect(() => {
        if (!user && !loading) {
            getCurrentUser();
        }
    }, [user, loading, getCurrentUser]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuth) {
        return <Navigate to={"/login"} replace />;
    }

    return <>{children}</>;
}

export default SafeRoute;