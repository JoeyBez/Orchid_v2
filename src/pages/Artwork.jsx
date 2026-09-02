import ImageUpload from "../components/ImageUpload";

export default function Artwork(params){
    const {yourAccount} = params;

    return(
        <div>
            <div className="emptyTab">
                <ImageUpload />
            </div>
        </div>
    );
}