import { useEffect } from "react";
import { useNewsStore } from "../stores/newsStore"
import Loader from "../components/reusables/Loader";

const News = () => {
    const { loading, fetchNews, news } = useNewsStore();

    useEffect(() => {
        fetchNews();
    }, [fetchNews])

    console.log(news);
    if (loading) {
        return <Loader />
    }

    return (
        <div>

        </div>
    )
}

export default News