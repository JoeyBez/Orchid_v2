import { useEffect, useState } from "react";
import ImageUpload from "../components/ImageUpload";
import { getArtworks } from "../functions";
import Loading from "../Loading";
import { useSearchParams } from "react-router-dom";

export default function Artwork(params){
    const {user, yourAccount} = params;
    const [searchParams, setSearchParams] = useSearchParams();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getWorks(){
            setLoading(true);
            // const a = await getArtworks(userId);
            setArtworks(user.featured);
            setLoading(false);
        }
        getWorks();
    }, [user]);

    return(
        <div>
            {loading ?
            <Loading />
            :
            <div>
                {artworks.length < 1 && <div className="emptyTab">
                    {yourAccount ?
                        <ImageUpload />
                    :
                        <p>No artworks.</p>
                    }
                </div>}
                {artworks.length > 0 && 
                <div className="artGrid"> 
                    {artworks.map((value, index) => (
                        <img className="gridImage" src={value} key={index} alt="" /> 
                    ))}
                </div>}
            </div>
            }
        </div>
    );
}