import { useNavigate, useSearchParams } from "react-router-dom";
import "./Profile.css"
import { IoLocationOutline } from "react-icons/io5";

export default function Profile({user, horizontal = false, title = false}){
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    function hasLocation(){
        const l = {
            any: user.country.id > -1 || user.state.id > -1 || user.city.id > -1,
            city: user.city.id > -1,
            state: user.state.id > -1,
            country: user.country.id > -1
        };
        return l;
    }

    return (
        <div className={`profileContainer ${horizontal ? "horizontal" : "vertical"}`} onClick={() => {navigate(`/account?user=${user.auth_id}`); window.location.reload();}}>
            <div className="profilePic small"><img src={user.avatar || "/default.png"} /></div>
            <div style={{display:"flex", flexDirection:"column", marginTop:"8px"}}>
                <small style={{width:"90px", textWrap:"wrap"}}>{user.name}</small>
                {title && <small style={{fontSize:"0.8rem", color:"grey", marginTop:"0.2rem"}}>{user.title}</small>}
                {hasLocation().any && horizontal && 
                    <small style={{
                        fontSize:"0.8rem", 
                        color:"grey", 
                        marginTop:"0.5rem"
                    }}>
                        <IoLocationOutline />
                        {hasLocation().city ? ` ${user.city.name}` 
                        : hasLocation().state ? ` ${user.state.state_code}`
                        : ` ${user.country.country_code}`}
                    </small>
                }
            </div>
        </div>
    );
}