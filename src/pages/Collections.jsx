import ImageUpload from "../components/ImageUpload";

export default function Collections(params){
    const {yourAccount} = params;

    return(
        <div>
            <div style={{marginTop:"25px"}}>
                {/* <p className="profileSectionHeader">Collections</p> */}
                {yourAccount && 
                <div style={{textAlign:"right", alignContent:"center", width:"100%"}}>
                    <ImageUpload />
                </div>
                }
            </div>
            <br />
            <br />
            <div className="emptyTab">
                No collections.
            </div>
        </div>
    );
}