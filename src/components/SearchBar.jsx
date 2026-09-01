import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Loading from "../Loading";
import Profile from "./Profile";
import './SearchBar.css';

export default function SearchBar(){
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getResults(){
            setLoading(true);
            if(search.length < 1) {setResults([]); return;}
            const {data, error} = await supabase
            .from('users')
            .select()
            .textSearch('search_params', `${search.replace(' ', '+')}:*`)
            .limit(10);

            if(error){
                console.error(error);
                return;
            }
            
            setResults(data);
            setLoading(false);
        }   
        getResults();
    }, [search]);

    return (
        <div style={{width:"100%", alignContent:"center"}}>
            <input className='formInput' style={{width:"100%", height:"25px"}} placeholder="Search artists..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            <div className={`searchResults ${search.length == 0 && "hide"}`}>
                <div className="resultsArea">
                    <small style={{color:"grey"}}>Results {`(${results.length})`}</small>
                    <br />
                    <br />
                    {loading ?
                    <Loading />
                    :
                    <div className="resultsGrid">
                        {results.map((result) => (
                            <Profile user={result} key={result.id} />
                        ))}
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}