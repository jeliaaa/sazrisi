import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

function AuthRoute({ children }: { children: React.ReactNode }) {
    const { user, fetchMe, loading } = useAuthStore();

    useEffect(() => {
        if (!user && !loading) {
            fetchMe();
        }
    }, [user, loading, fetchMe]);

    return <>{children}</>;
}

export default AuthRoute;
