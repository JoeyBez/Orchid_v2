import FollowingList from "../components/FollowingList";

export default function Home(params){
    const {session} = params;

    return (
        <div style={{textAlign:"center"}}>
            <h3 style={{fontWeight:"normal"}}>Discover</h3>
            {session && <div className="profileBackground">
                <FollowingList authId={session.user.id}/>
            </div>}
        </div>
    );
}