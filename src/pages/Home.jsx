import FollowingList from "../components/FollowingList";
import Tinder from "../components/Tinder";

export default function Home(params){
    const {session} = params;

    return (
        <div style={{textAlign:"center"}}>
            <h3 style={{fontWeight:"normal"}}>Discover</h3>
            {session && <div className="profileBackground">
                <Tinder session={session}/>
                <FollowingList auth_id={session.user.id}/>
            </div>}
        </div>
    );
}