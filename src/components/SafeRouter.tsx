import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import Loader from "./reusables/Loader";
import { Navigate } from "react-router-dom";

function SafeRoute({ children }: { children: React.ReactNode }) {
    const { isAuth, user, fetchMe, loading } = useAuthStore();

    useEffect(() => {
        if (!user && !loading) {
            fetchMe();
        }
    }, [user, loading, fetchMe]);
    console.log(user);

    if (loading) return <Loader />;
    if (!isAuth) return <Navigate to="/login" replace />;

    return <>{children}</>;
}

export default SafeRoute;
