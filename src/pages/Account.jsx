import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import './Account.css'
import { IoLocationOutline } from "react-icons/io5";
import { redirect, useSearchParams } from "react-router-dom";

export default function Account(params){
    const {session, getSession} = params;

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [yourAccount, setYourAccount] = useState(false);

    useEffect(() => {
        async function getUser(){
            const id = searchParams.get('user');
            // const id = await getSession();
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
    
    return (
        <div>
            {loading ?
            <Loading />
            :
            user &&
            <div>
                <div className="accountHeader">
                    <div className="accountHeaderInfo">
                        <img src="/default.png" className="profilePic large"/>
                        <div>
                            <p className="name">{user.name}</p>
                            <p className="title">{user.title}</p>
                        </div>
                    </div>
                    {yourAccount ? 
                        <button className="editProfile">Edit Profile</button> 
                        : 
                        <button className="editProfile">Follow</button>
                    }
                </div>
                <p>{user.bio}</p>
                <p className="location"><IoLocationOutline /> {user.location}</p>
                <br />
                {yourAccount && <p style={{textDecoration:"underline", width:"fit-content"}} onClick={signOut}>Log Out</p>}
            </div>
            }
        </div>
    );
}