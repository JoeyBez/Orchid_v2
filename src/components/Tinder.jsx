import { useEffect, useState } from 'react';
import './Tinder.css';
import { follow, getUser, isFollowing } from '../functions';
import Loading from '../Loading';
import Profile from './Profile';
import { IoArrowForward, IoClose, IoHeartOutline } from 'react-icons/io5';
import { TbPlayerTrackNext } from "react-icons/tb";

export default function Tinder({session}){
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState();

    const [isFollowingUser, setIsFollowingUser] = useState(false);

    useEffect(() => {
        async function getAccount(){
            setLoading(true);
            if(!session) return;
            const user = await getUser(session.user.id);
            setAccount(user);
            setLoading(false);
        }
        getAccount();
    }, [session]);

    useEffect(() => {
        updateCounts();
    }, [account])

    async function updateCounts(){
        if(!session || !account) return;
        const isf = await isFollowing(session.user.id, account.authId);
        setIsFollowingUser(isf);
    }

    return (
        <div className="profileSection" style={{
            textAlign:"center",
            justifyItems:"center",
            alignContent:"center",
            minHeight:"450px"
        }}>
            {loading ?
            <div style={{width:"100%", height:"50px"}}><Loading /></div>
            :
            <div className='discover-container'>
                <div className="discover-image">
                    <img src={null} alt="" />
                </div>
                <br />
                <div className='discover-buttons'>
                    <div style={{justifyItems:"normal", width:"90%", maxWidth:"400px"}}>
                        <Profile user={account} horizontal={true} title={true} />
                    </div>
                    
                    <div className='right' style={{display:"flex", flexDirection:"row-reverse", gap:"5px"}}>
                        <div><div style={{width: "fit-content", cursor: "pointer"}}><IoClose /></div></div>
                        <div><div style={{width: "fit-content", cursor: "pointer"}}><IoHeartOutline /></div></div>
                    </div>
                </div>
                <br />
                <button className={`followButton ${isFollowingUser ? "following" : ""}`} onClick={() => {
                    setIsFollowingUser(!isFollowingUser); 
                    follow(session.user.id, account.authId, updateCounts);
                }}>
                    {isFollowingUser ? "Following" : "Follow"}
                </button>
            </div>
            }
        </div>
    );
}