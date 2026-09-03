import { useEffect, useState } from 'react';
import './Tinder.css';
import { follow, getArtworks, getUser, isFollowing } from '../functions';
import Loading from '../Loading';
import Profile from './Profile';
import { IoArrowForwardCircle, IoHeartOutline, IoPersonAddOutline, IoPersonRemove } from 'react-icons/io5';
import { Tag } from './Tags';
import { supabase } from '../../supabaseClient';

export default function Tinder({session}){
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState([]);
    const [account, setAccount] = useState();
    const [artwork, setArtwork] = useState();
    const [next, SetNext] = useState(0);

    const [isFollowingUser, setIsFollowingUser] = useState(false);

    useEffect(() => {
        async function getAccount(){
            setLoading(true);
            if(!session) return;
            // const user = await getUser(session.user.id);
            // setAccount(user);

            if(next >= search.length){
                const {data} = await supabase.rpc('discover', {user_id: session.user.id});
                setSearch(data);
                const user = data[0];
                setAccount(user)
                await updateCounts(user);
                SetNext(0);
                
                // const a = await getArtworks(user.auth_id);
                // setArtwork(a);
            }else{
                const user = search[next];
                setAccount(user)
                await updateCounts(user);
                // const a = await getArtworks(user.auth_id);
                // setArtwork(a);
            }

            setLoading(false);
        }
        getAccount();
    }, [next]);

    // useEffect(() => {
    //     updateCounts();
    // }, [account])

    async function updateCounts(user){
        if(!session || !user) return;
        const isf = await isFollowing(session.user.id, user.auth_id);
        setIsFollowingUser(isf);
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
                        <div><div style={{width: "fit-content", cursor: "pointer"}} onClick={() => SetNext(next + 1)}><IoArrowForwardCircle /></div></div>
                        <div><div style={{width: "fit-content", cursor: "pointer"}}><IoHeartOutline className='click' /></div></div>
                        <div><div 
                            style={{width: "fit-content", cursor: "pointer"}}
                            onClick={() => {
                                setIsFollowingUser(!isFollowingUser); 
                                follow(session.user.id, account.auth_id, updateCounts);
                            }}
                        >{isFollowingUser ? <IoPersonRemove className='click' /> : <IoPersonAddOutline className='click' />}
                        </div></div>
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