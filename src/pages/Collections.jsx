import { useState } from "react";
import ImageUpload from "../components/ImageUpload";

export default function Collections(params){
    const {yourAccount} = params;
    const [artworks, setArtworks] = useState([]);

    return(
        <div>
            {artworks.length < 1 && <div className="emptyTab">
                {yourAccount ?
                    <ImageUpload />
                :
                    <p>No Collections.</p>
                }
            </div>}
        </div>
    );
}