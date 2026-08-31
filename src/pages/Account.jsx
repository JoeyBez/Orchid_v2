import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import './Account.css'
import { IoGlobeOutline, IoLocationOutline, IoLogoInstagram } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { changePage, follow, followerCount, followingCount, isFollowing } from "../functions";
import FollowingList from "../components/FollowingList";
import { IoIosLink } from "react-icons/io";

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
        const fing = await followingCount(user.authId);
        setFollowing(fing);
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
                    <div className="accountHeaderInfo">
                        <div className="profilePic large"><img src={user.avatar || "/default.png"} /></div>
                        <div>
                            <p className="name">{user.name}</p>
                            <p className="title">{user.title}</p>
                        </div>
                        <p className="bio">{user.bio}</p>
                        {hasLocation() && <p className="location"><IoLocationOutline />{user.city.id > -1 ? ` ${user.city.name}` : ""}{user.state.id > -1 ? ` ${user.state.state_code}` : ""}{user.country.id > -1 ? ` ${user.country.iso3}` : ""}</p>}
                    </div>
                    <div className="profileButtons">
                        {yourAccount ? 
                            <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                                <button className="editProfile" onClick={() => {changePage("/edit-profile", navigate)}}>Edit Profile</button>
                                <button className="editProfile" onClick={signOut}>Log Out</button>
                            </div>
                            : 
                            <button className={`editProfile ${isFollowingUser ? "following" : ""}`} onClick={() => follow(session.user.id, user.authId, updateCounts)}>{isFollowingUser ? "Following" : "Follow"}</button>
                        }
                        {/* <a href="https://joeybezner.com" target="_blank" className="textLink"><IoIosLink /> Website</a>
                        <a href="https://joeybezner.com" target="_blank" className="textLink"><IoLogoInstagram /> Instagram</a> */}
                    </div>
                </div>
                <br />
                <div className="accountHeaderCounts">
                    {/* <div className="profileCount">
                        <p><b>0</b></p>
                        <p>Discovered</p>
                    </div>
                    <div className="spacer"/> */}
                    <div className="profileCount">
                        <p><b>{followers}</b></p>
                        <p>Followers</p>
                    </div>
                    <div className="spacer"/>
                    <div className="profileCount">
                        <p><b>{following}</b></p>
                        <p>Following</p>
                    </div>
                </div>
                <br />
                <br />
                <div className="profileBackground">
                    <div className="profileSection">
                        <p className="profileSectionHeader">Featured Work</p>
                        <div className="emptyProfileSection"><small>No featured work</small></div>
                    </div>
                    {yourAccount && 
                    <FollowingList authId={user.authId}/>
                    }
                </div>
            </div>
            }
        </div>
    );
}