import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import Loader from "./reusables/Loader";

function AuthRoute({ children }: { children: React.ReactNode }) {
    const { user, fetchMe, loading } = useAuthStore();

    useEffect(() => {
        if (!user && !loading) {
            fetchMe();
        }
    }, [user, loading, fetchMe]);

    if (loading) return <Loader />;

    return <>{children}</>;
}

export default AuthRoute;
