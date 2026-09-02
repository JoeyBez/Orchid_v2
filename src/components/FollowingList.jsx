import { useEffect, useState } from "react";
import Profile from "./Profile";
import './Profile.css'
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";

export default function FollowingList(params){
    const {authId} = params;
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    
    useEffect(() => {
        async function getFollowing(){
            setLoading(true);
            const {data, error} = await supabase
            .from('followaccounts')
            .select('*')
            .eq('follower', authId)
            .limit(25)

            if(error){
                console.log(error);
                return;
            }
            
            data.sort((a, b) => {return new Date(b.date).getTime() - new Date(a.date).getTime();})
            setFollowing(data);
            setLoading(false);
        }
        getFollowing(following);
    }, [authId]);

    return(
        <div className="profileSection">
            <p className="profileSectionHeader">Artists you follow</p>
            {loading ?
            <Loading />
            :
            following.length > 0 ?
                <div className="profileList">
                    {following.map((user) => (
                        <Profile user={user} key={user.id} />
                    ))}
                </div>
            :
                <div className="emptyProfileSection"><small>You are not folliwing any artists</small></div>
            }
        </div>
    );
}