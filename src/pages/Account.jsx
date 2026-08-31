import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import './Account.css'
import { useSearchParams } from "react-router-dom";

export default function Account(params){
    const {session} = params;

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        async function getUser(){
            const id = searchParams.get('user');
            setLoading(true);
            if(!id) return;

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
        }
        getUser();
    }, [searchParams]);
    
    return (
        <div>
            {loading ?
            <Loading />
            :
            user &&
            <div>
                <div className="accountHeader">
                    <div className="accountHeaderInfo">
                        <img src="../src/assets/default.png" className="profilePic large"/>
                        <div>
                            <p className="name">{user.name}</p>
                            <p className="title">{user.title}</p>
                        </div>
                    </div>
                    {session ? session.user.id == user.authId && <button className="editProfile">Edit Profile</button> : null}
                </div>
                <br />
                <div className="accountHeaderCounts">
                    <p><b>0</b> Discovered</p>
                    <p><b>0</b> Followers</p>
                </div>
                <br />
                <div className="seperator" />
            </div>
            }
        </div>
    );
}