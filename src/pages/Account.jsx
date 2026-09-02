import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import './Account.css'
import { IoAppsSharp, IoCartOutline, IoColorPaletteOutline, IoGlobeOutline, IoLocationOutline, IoLogoInstagram } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { changePage, follow, followerCount, followingCount, formatNumber, isFollowing } from "../functions";
import FollowingList from "../components/FollowingList";
import { IoIosLink } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import ImageUpload from "../components/ImageUpload";
import { Tag } from "../components/Tags";
import { TabLayout } from "../components/TabLayout";
import Collections from "./Collections";
import Artwork from "./Artwork";
import { GoGraph } from "react-icons/go";

export default function Account(params){
    const navigate = useNavigate();
    const {session, getSession} = params;

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [yourAccount, setYourAccount] = useState(false);

    const [followers, setFollowers] = useState(" ");
    const [following, setFollowing] = useState(0);
    const [isFollowingUser, setIsFollowingUser] = useState(false);

    useEffect(() => {
        async function getUser(){
            const id = searchParams.get('user');
            setLoading(true);
            setUser(null);
            if(id == null) return;

            const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('authId', id);

            if(error){
                console.error(error);
                setUser(null);
                return;
            }

            setUser(data[0]);
            setLoading(false);
            // console.log(isf);
        }
        isYourAccount();
        getUser();
    }, [searchParams.get('user')]);

    async function isYourAccount(){
        const id = searchParams.get('user');
        const sesh = await getSession();
        setYourAccount(id == sesh);
    }

    async function signOut(){
        const { error } = await supabase.auth.signOut();
        window.location.reload();
    }

    function hasLocation(){
        return user.country.id > -1 ||
               user.state.id > -1 ||
               user.city.id > -1;
    }

    useEffect(() => {
        if(!session || !user) return;
        updateCounts();
    }, [session, user]);

    async function updateCounts(){
        const isf = await isFollowing(session.user.id, user.authId);
        setIsFollowingUser(isf);

        const f = await followerCount(user.authId);
        setFollowers(f);
        // const fing = await followingCount(user.authId);
        // setFollowing(fing);
    }
    
    return (
        <div>
            {loading ?
            <Loading />
            :
            user &&
            <div>
                <div className="accent" />
                <div className="accountHeader">
                    {yourAccount && <div className="editProfile right" onClick={() => {changePage("/edit-profile", navigate)}}><FaRegEdit /></div>}
                    {yourAccount && <div className="editProfile left" onClick={signOut}>Log Out</div>}
                    <div className="accountHeaderInfo">
                        <div className="profilePic large" style={{border: "10px solid white", backgroundColor:"white", margin:"auto"}}><img src={user.avatar || "/default.png"} /></div>
                        <div style={{margin:"auto"}}>
                            <p className="name">{user.name}</p>
                            <p className="title">{user.title}</p>
                        </div>
                        <div style={{margin:"-0.5rem auto -0.5rem auto"}} className="location">{hasLocation() && <p><IoLocationOutline />{user.city.id > -1 ? ` ${user.city.name}` : ""}{user.state.id > -1 ? ` ${user.state.state_code}` : ""} &nbsp;&bull;&nbsp;&nbsp;</p>}<p><b>{formatNumber(followers)}</b> followers</p></div>
                        <div style={{margin:"auto"}} className="bio"><p>{user.bio}</p></div>
                        {user.keywords.length > 0 && <div style={{
                            marginLeft:"auto",
                            marginRight:"auto",
                            display:"flex",
                            gap:"10px",
                            width: "90%",
                            flexWrap:"wrap",
                            justifyContent:"center",
                            marginTop:"1.5rem"
                        }}>
                            {user.keywords.split(', ').map((value, index) => (
                                <Tag text={value} key={index} removable={false} />
                            ))}
                        </div>}
                    </div>
                    {/* <div style={{display:"flex", gap:"10px"}}>
                        <a href="https://joeybezner.com" target="_blank" className="textLink"><IoGlobeOutline /> Website</a>
                        <a href="https://joeybezner.com" target="_blank" className="textLink"><IoLogoInstagram /> Instagram</a>
                    </div> */}
                    {!yourAccount && <div style={{margin:"auto", marginTop:"30px"}} className="profileButtons">
                        <button className={`followButton ${isFollowingUser ? "following" : ""}`} onClick={() => follow(session.user.id, user.authId, updateCounts)}>{isFollowingUser ? "Following" : "Follow"}</button>
                    </div>}
                </div>
                <br />
                <br />
                <TabLayout tabs={[
                    { title:<IoAppsSharp />, element:<Collections yourAccount={yourAccount} /> },
                    { title:<IoColorPaletteOutline />, element:<Artwork yourAccount={yourAccount} /> }, 
                    { title:<IoCartOutline />, element:<div/> },
                    { title:<GoGraph />, element:<div /> },
                ]} />
            </div>
            }
        </div>
    );
}