import { useEffect, useState } from "react";
import Loading from "../Loading";
import { getSession, getUser } from "../functions";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function EditProfile(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState();
    const [userId, setUserId] = useState("");

    const [avatar, setAvatar] = useState();
    const [uploadError, setUploadError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");

    const [country, setCountry] = useState();
    const [state, setState] = useState();
    const [city, setCity] = useState();

    useEffect(() => {
        async function check(){
            setLoading(true);
            const s = await getSession();
            setSession(s);
            if(!s) return;

            const user = await getUser(s.user.id);
            setUserId(user.id);
            if(user){
                setAvatar(user.avatar);
                setName(user.name);
                setTitle(user.title);
                setBio(user.bio);
                setCountry(user.country);
                setState(user.state);
                setCity(user.city);
            }

            setLoading(false);
        }
        check();
    }, []);

    async function save(){
        setLoading(true);

        const { error } = await supabase
        .from('users')
        .update({ 
            name: name, 
            title: title,
            bio: bio,
            country: country,
            state: state,
            city: city
        })
        .eq('id', userId)

        if(error) {console.error(error); return;}
        navigate(`/account?user=${session.user.id}`);
        window.location.reload();
    }

    async function uploadImage(e){
        const file = e.target.files[0];
  
        if (!file) {
            console.error('No image was uploaded');
            return;
        }

        const fileName = `avatar-${session.user.id}`;

        try {
            setUploading(true);
            // 3. Upload the file to your specific bucket
            const { data, error } = await supabase.storage
            .from('avatars') // Replace with your bucket name
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type // Ensures correct MIME type handling
            });

            if (error) {
                throw error;
            }

            console.log('Upload successful! File details:', data);

            // 4. (Optional) Get the public URL if your bucket is public
            const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
            console.log('Public URL:', publicUrlData.publicUrl);

            const { error: updateError } = await supabase
            .from('users')
            .update({ 
                avatar: `${publicUrlData.publicUrl}?t=${Date.now()}`
            })
            .eq('id', userId);

            if(updateError) {throw updateError;}
            setAvatar(publicUrlData.publicUrl);
            setUploadError("Success");
            setUploading(false);

        } catch (error) {
            setUploading(false);
            setUploadError(error.message);
            console.error('Error uploading image:', error.message);
        }
    }

    return loading || !userId ? 
    <Loading />
    :
    (
    <div>
        <h2>Edit Profile</h2>
        <small style={{color:"grey"}}>Change your profile details</small>
        <br />
        <br />
        <h3>Profile Picture</h3>
        <div>
            <div className="profilePic large"><img src={avatar || "/default.png"} /></div>
            <br />
            {uploading ? <Loading /> : <div>
                <input type="file" accept="image/*" onChange={(e) => {uploadImage(e)}}/>
                <br />
                <small style={{color: uploadError == "Success" ? "green" : "red"}}>{uploadError}</small>
            </div>}
        </div>
        <br />
        <div>
            <h3>Details</h3>
            <div style={{display:"grid", gridTemplateColumns:"42vw 1fr 42vw"}}>
                <div className="formInputContainer">
                    <label>Full Name</label>
                    <input className="formInput" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div></div>
                <div className="formInputContainer">
                    <label>Title</label>
                    <input className="formInput" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={30}/>
                    <small className="characterLimit">({title.length} / 30)</small>
                </div>
            </div>
            <div className="formInputContainer">
                <label>Bio</label>
                <input className="formInput" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160}/>
                <small className="characterLimit">({bio.length} / 160)</small>
            </div>
            <br />
            <h3>Location</h3>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"20px"}}>
                <div className="formInputContainer">
                    <label>Country</label>
                    <CountrySelect defaultValue={country} value={country} onChange={(e) => {
                        setCountry(e);
                    }}/>
                </div>
                <div className="formInputContainer">
                    <label>State</label>
                    <StateSelect countryid={country.id} defaultValue={state} value={state} onChange={(e) => {
                        setState(e);
                    }}/>
                </div>
                <div className="formInputContainer">
                    <label>City</label>
                    <CitySelect defaultValue={city} countryid={country.id} stateid={state.id} value={city} onChange={(e) => {
                        setCity(e);
                    }}/>
                </div>
            </div>
        </div>
        <button className="loginButton" style={{marginTop:"50px"}} onClick={save}>Save</button>
    </div>
    );
}