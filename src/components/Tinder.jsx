import { useEffect, useState } from 'react';
import './Tinder.css';
import { follow, getArtworks, getUser, isFollowing } from '../functions';
import Loading from '../Loading';
import Profile from './Profile';
import { IoArrowForwardCircle, IoPersonAddOutline, IoPersonRemove } from 'react-icons/io5';
import { BiUndo } from "react-icons/bi";
import { Tag } from './Tags';
import { supabase } from '../../supabaseClient';

export default function Tinder({session}){
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState([]);
    const [account, setAccount] = useState();
    const [lastAccount, setLastAccount] = useState();
    const [back, setBack] = useState(false);
    const [next, SetNext] = useState(0);

    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [isLikingUser, setIsLikingUser] = useState(false);

    useEffect(() => {
        async function getAccount(){
            setLoading(true);
            if(!session) return;

            if(next >= search.length){
                const {data} = await supabase.rpc('discover', {user_id: session.user.id});
                setSearch(data);
                const user = data[0];
                setAccount(user)
                await updateCounts(user);
                SetNext(0);
                
            }else{
                const user = search[next];
                setAccount(back ? lastAccount : user)
                await updateCounts(back ? lastAccount : user);
                if(back) setLastAccount(null);
            }

            setLoading(false);
        }
        getAccount();
    }, [session, next, back]);

    async function updateCounts(user){
        if(!session || !user) return;
        const isf = await isFollowing(session.user.id, user.auth_id);
        setIsFollowingUser(isf);
        // const isl = await isFollowing(session.user.id, user.auth_id, 'like');
        // setIsLikingUser(isl);
    }

    return (
        <div className="profileSection" style={{
            textAlign:"center",
            justifyItems:"center",
            alignContent:"center",
            minHeight:"550px"
        }}>
            {loading ?
            <div></div>// <div style={{width:"100%", height:"50px"}}><Loading /></div>
            :
            <div className='discover-container'>
                <div className="discover-image">
                    <img src={account.featured.length > 0 ? account.featured[0] : null} alt="" />
                </div>
                <br />
                <div className='discover-buttons'>
                    <div style={{justifyItems:"normal", width:"100%", maxWidth:"400px"}}>
                        <Profile user={account} horizontal={true} title={true} />
                    </div>
                    
                    <div className='right' style={{fontSize:"1.7rem", display:"flex", flexDirection:"row-reverse", gap:"5px"}}>
                        <div><div style={{width: "fit-content", cursor: "pointer"}} onClick={() => {setLastAccount(account); SetNext(back ? next : next + 1); if(back) {setBack(false);}}}><IoArrowForwardCircle /></div></div>
                        {/* like button */}
                        {/* <div><div 
                            style={{width: "fit-content", cursor: "pointer"}}
                            onClick={() => {
                                setIsLikingUser(!isLikingUser); 
                                follow(session.user.id, account.auth_id, updateCounts, 'like');
                            }}
                        >{isLikingUser ? <IoHeart className='click' /> : <IoHeartOutline className='click' />}
                        </div></div> */}
                        {/* follow button */}
                        <div><div 
                            style={{width: "fit-content", cursor: "pointer"}}
                            onClick={() => {
                                setIsFollowingUser(!isFollowingUser); 
                                follow(session.user.id, account.auth_id, updateCounts);
                            }}
                        >{isFollowingUser ? <IoPersonRemove className='click' /> : <IoPersonAddOutline className='click' />}
                        </div></div>
                        {lastAccount && <div><div style={{width: "fit-content", cursor: "pointer"}} onClick={() => {setBack(true);}}><BiUndo /></div></div>}
                    </div>
                </div>
                <div style={{width:"100%", maxWidth: "400px"}}>
                    <div className='discover-tags'>
                        {account.keywords.length > 0 && account.keywords.split(', ').map((value, index) => (
                            <Tag text={value} key={index} removable={false} />
                        ))}
                    </div>
                    <p className='discover-bio'>{account.bio}</p>
                </div>
                {/* <button className={`followButton ${isFollowingUser ? "following" : ""}`} onClick={() => {
                    setIsFollowingUser(!isFollowingUser); 
                    follow(session.user.id, account.auth_id, updateCounts);
                }}>
                    {isFollowingUser ? "Following" : "Follow"}
                </button> */}
            </div>
            }
        </div>
    );
}