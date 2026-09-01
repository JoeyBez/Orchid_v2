import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import './Account.css'
import { IoGlobeOutline, IoLocationOutline, IoLogoInstagram } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { changePage, follow, followerCount, followingCount, formatNumber, isFollowing } from "../functions";
import FollowingList from "../components/FollowingList";
import { IoIosLink } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import ImageUpload from "../components/ImageUpload";

export default function Account(params){
    const navigate = useNavigate();
    const {session, getSession} = params;

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [yourAccount, setYourAccount] = useState(false);

    const [followers, setFollowers] = useState(0);
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
    }, [searchParams]);

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
                        <div style={{margin:"auto"}} className="location">{hasLocation() && <p><IoLocationOutline />{user.city.id > -1 ? ` ${user.city.name}` : ""}{user.state.id > -1 ? ` ${user.state.state_code}` : ""} &nbsp;&bull;&nbsp;&nbsp;</p>}<p><b>{formatNumber(followers)}</b> followers</p></div>
                        <p style={{margin:"auto"}} className="bio">{user.bio}</p>
                    </div>
                    {/* <div style={{display:"flex", gap:"10px"}}>
                        <a href="https://joeybezner.com" target="_blank" className="textLink"><IoGlobeOutline /> Website</a>
                        <a href="https://joeybezner.com" target="_blank" className="textLink"><IoLogoInstagram /> Instagram</a>
                    </div> */}
                    <div style={{margin:"auto", marginTop:"30px"}} className="profileButtons">
                        {!yourAccount &&
                            <button className={`followButton ${isFollowingUser ? "following" : ""}`} onClick={() => follow(session.user.id, user.authId, updateCounts)}>{isFollowingUser ? "Following" : "Follow"}</button>
                        }
                    </div>
                </div>
                <br />
                <div className="profileBackground">
                    <div className="profileSection">
                        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr"}}>
                            <p className="profileSectionHeader">Featured Work</p>
                            {yourAccount && <div style={{textAlign:"right", alignContent:"center"}}>
                                <ImageUpload />
                            </div>}
                        </div>
                        <div className="emptyProfileSection"><small>No featured work</small></div>
                    </div>
                    {/* {yourAccount && 
                    <FollowingList authId={user.authId}/>
                    } */}
                </div>
            </div>
            }
        </div>
    );
}