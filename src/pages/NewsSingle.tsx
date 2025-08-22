import { useEffect } from "react";
import { useNewsStore } from "../stores/newsStore"
import { useParams } from "react-router-dom";
import Loader from "../components/reusables/Loader";

const NewsSingle = () => {
    const { loading, fetchNewsSingle, newsSingle } = useNewsStore();
    const { id } = useParams()
    useEffect(() => {
        if (id) {
            fetchNewsSingle(parseInt(id))
        }
    }, [id, fetchNewsSingle])

    if (loading) {
        return <Loader />
    }

    return (
        newsSingle && <div className="w-full h-full p-6 space-y-6">
            <div className="flex justify-between gap-4 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-5">
                <img src={'https://picsum.photos/300/100'} alt="banner" className="w-[60%] max-[500px]:w-full" />
                <div className="w-[38%] max-[500px]:w-full max-[500px]:text-center">
                    <h2 className="title font-semibold text-dark-color">{newsSingle.title}</h2>
                    <h6 className="text-gray-500 plain-text">{new Date(newsSingle.created_at).toISOString().split("T")[0]}</h6>
                </div>
            </div>

            <div className="space-y-4 plain-text">
                <p>
                    {newsSingle.description}
                </p>
            </div>
        </div>
    )
}

export default NewsSingle