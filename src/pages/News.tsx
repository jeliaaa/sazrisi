import { useEffect } from "react";
import { useNewsStore } from "../stores/newsStore"
import Loader from "../components/reusables/Loader";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen w-full">
            <h1 className="title text-dark-color">ახალი ამბები</h1>
            <div className="flex gap-x-3 mt-3 justify-around flex-wrap">
                {news.map((news) => (
                    <Link to={`/news/${news.id}`} key={news.id} className="flex flex-col shadow-md w-[350px]">
                        <span>{news.created_at.toString()}</span>
                        <img src="https://picsum.photos/350/200" className="w-full" />
                        <div className="p-3">
                            <span className="title text-dark-color">რა არის საზრისი?</span>
                            <span className="text-main-color flex  justify-end hover:underline">იხ. სრულად</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default News