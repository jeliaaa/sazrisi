import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/authStore";

function AuthRoute({ children }: { children: React.ReactNode }) {
    const isAuth = useAuthStore((state) => state.isAuth);
    const fetchMe = useAuthStore((state) => state.fetchMe);
    const hasFetched = useRef(false);
    
    useEffect(() => {
        if (!isAuth && !hasFetched.current) {
            hasFetched.current = true;
            fetchMe();
        }
        return () => useAuthStore.setState({error: null});
    }, []);



    return <>{children}</>;
}

export default AuthRoute;