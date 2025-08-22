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

    console.log(newsSingle);

    if (loading) {
        return <Loader />
    }

    return (
        <div>NewsSingle</div>
    )
}

export default NewsSingle