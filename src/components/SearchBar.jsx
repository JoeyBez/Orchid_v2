import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import Profile from "./Profile";
import './SearchBar.css';
import { useSearchParams } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

export default function SearchBar(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getResults(){
            if(search.length < 1) {setResults([]); return;}
            setLoading(true);
            const { data, error } = await supabase.rpc("search_artists", {
                search_text: search
            });

            if(error){
                console.error(error);
                return;
            }
            
            setResults(data);
            setLoading(false);
        }   
        getResults();
    }, [search]);

    useEffect(() => {
        const p = searchParams.get('search');
        if(!p) return;
        setSearch(p.replace('+', ' '));
    }, [searchParams.get('search')])

    return (
        <div style={{width:"100%", alignContent:"center"}}>
            <div style={{display:"flex", position:"relative", alignItems:"center"}}>
                <input 
                    className='formInput' 
                    style={{width:"100%", height:"25px", paddingLeft:"5px"}} 
                    placeholder='Search...'
                    value={search} 
                    onChange={(e) => {setSearch(e.target.value);}}
                />
                {search.length > 0 && <IoCloseOutline style={{
                    position:"absolute",
                    right: "5px",
                    fontSize:"1.2rem",
                    cursor:"pointer",
                    color:"grey",
                    backgroundColor:"white"
                }}
                onClick={() => {setSearch("");}}
                />}
            </div>
            <div className={`searchResults ${search.length == 0 && "hide"}`}>
                <div className="resultsArea">
                    <small style={{color:"grey"}}>Results</small>
                    <br />
                    <br />
                    {loading ?
                    <Loading />
                    :
                    <div className="resultsGrid">
                        {results.map((result, index) => (
                            <Profile user={result} key={index} />
                        ))}
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}