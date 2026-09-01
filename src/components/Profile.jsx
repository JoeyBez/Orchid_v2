import { useNavigate, useSearchParams } from "react-router-dom";
import "./Profile.css"

export default function Profile(params){
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const {user} = params;

    return (
        <div className="profileContainer" onClick={() => {navigate(`/account?user=${user.authId}`); window.location.reload();}}>
            <div className="profilePic small"><img src={user.avatar || "/default.png"} /></div>
            <small>{user.name}</small>
        </div>
    );
}