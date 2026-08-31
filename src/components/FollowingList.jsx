import { useEffect, useState } from "react";
import Profile from "./Profile";
import './Profile.css'
import { supabase } from "../../supabaseClient";

export default function FollowingList(params){
    const {authId} = params;
    const [following, setFollowing] = useState([]);
    
    useEffect(() => {
        async function getFollowing(){
            const {data, error} = await supabase
            .from('followaccounts')
            .select('*')
            .eq('follower', authId)

            if(error){
                console.log(error);
                return;
            }
            
            setFollowing(data);
        }
        getFollowing(following);
    }, [authId]);

    return(
        <div className="profileSection">
            <p className="profileSectionHeader">Artists you follow</p>
            {following.length > 0 ?
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