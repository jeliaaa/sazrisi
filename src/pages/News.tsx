import { useEffect } from "react";
import { useNewsStore } from "../stores/newsStore"
import Loader from "../components/reusables/Loader";
import { Link } from "react-router-dom";

const News = () => {
    const { loading, fetchNews, news } = useNewsStore();

    function shortenText(text: string, wordLimit: number): string {
        const words = text.split(" ");
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(" ") + "...";
    }


    useEffect(() => {
        fetchNews();
    }, [fetchNews])

    console.log(news);
    if (loading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen w-full p-5">
            <h1 className="title text-dark-color">ახალი ამბები</h1>
            <div className="flex gap-x-3 mt-3 justify-around flex-wrap">
                {news.map((news) => (
                    <Link to={`/news/${news.id}`} key={news.id} className="flex flex-col shadow-md w-[350px]">
                        <span>{new Date(news.created_at).toISOString().split("T")[0]}</span>
                        <img src="https://picsum.photos/350/200" className="w-full" />
                        <div className="p-3">
                            <span className="title text-dark-color">{news.title}</span>
                            <span className="plain-text text-dark-color">
                                {shortenText(news.description, 7)}
                            </span>
                            <span className="text-main-color flex  justify-end hover:underline">იხ. სრულად</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default News