import { useEffect, useState } from "react";
import { useNewsStore } from "../stores/newsStore"
import Loader from "../components/reusables/Loader";
import { Link } from "react-router-dom";
import { INews } from "../types/types";

const News = () => {
    const [page, setPage] = useState<number>(1);
    const newsPerPage = 3;
    const [filteredNews, setFilteredNews] = useState<INews[] | []>([]);
    const { loading, fetchNews, news } = useNewsStore();
    const totalPages = Math.ceil(news.length / newsPerPage);

    function shortenText(text: string, wordLimit: number): string {
        const words = text.split(" ");
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(" ") + "...";
    }

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    useEffect(() => {
        setFilteredNews(news.slice((page - 1) * newsPerPage, page * newsPerPage));
    }, [news, page]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen w-full p-5">
            <h1 className="title text-dark-color">ახალი ამბები</h1>
            <div className="flex gap-x-3 mt-3 justify-around flex-wrap">
                {filteredNews.map((news) => (
                    <Link to={`/news/${news.id}`} key={news.id} className="flex flex-col shadow-md w-[320px]">
                        <span>{new Date(news.created_at).toISOString().split("T")[0]}</span>
                        <img src="https://picsum.photos/350/200" className="w-full" />
                        <div className="p-3 flex flex-col gap-y-3">
                            <span className="title text-dark-color">{news.title}</span>
                            <span className="plain-text text-dark-color">
                                {shortenText(news.description, 7)}
                            </span>
                            <span className="text-main-color flex  justify-end hover:underline">იხ. სრულად</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex gap-x-4 justify-center items-center mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded ${page === i + 1 ? "bg-main-color text-white" : "bg-gray-200"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

        </div>
    )
}

export default News