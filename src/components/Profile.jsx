import { useNavigate, useSearchParams } from "react-router-dom";
import "./Profile.css"

export default function Profile({user, horizontal = false, title = false}){
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    return (
        <div className={`profileContainer ${horizontal ? "horizontal" : "vertical"}`} onClick={() => {navigate(`/account?user=${user.authId}`); window.location.reload();}}>
            <div className="profilePic small"><img src={user.avatar || "/default.png"} /></div>
            <div style={{display:"flex", flexDirection:"column", marginTop:"8px"}}>
                <small style={{width:"90px", textWrap:"wrap"}}>{user.name}</small>
                {title && <small style={{fontSize:"0.8rem", color:"grey"}}>{user.title}</small>}
            </div>
        </div>
    );
}