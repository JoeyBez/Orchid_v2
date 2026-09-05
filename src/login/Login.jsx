import { useEffect, useState } from "react";
import './Login.css'
import Loading from '../Loading';
import { signInWithEmail, signUpNewUser, supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [result, setResult] = useState(null);
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordData, setPasswordData] = useState({upper: false, lower: false, symbol: false, number: false});

    async function signIn(e){
        e.preventDefault();
        setLoading(true);
        const res = await signInWithEmail(email, password);
        setResult(res);
        setLoading(false);
        if(!res) navigate('/');
    }

    async function signInNew(e){
        e.preventDefault();
        if(!checkPassword()) {setResult({message: "missing password requirements"}); return;}
        setLoading(true);
        const res = await signUpNewUser(email, password);
        setResult(res);
        setLoading(false);

        if(res.user){
            const { error } = await supabase
            .from('users')
            .insert({ name: name, email: email, auth_id: res.user.id });
            
            if(error){
                console.log(error);
                return;
            }
        }

        navigate('/');
    }

    function checkPassword(){
        const data = {upper: false, lower: false, symbol: false, number: false};
        const upperReg = /[A-Z]/;
        const lowerReg = /[a-z]/;
        const symbolReg = /[^A-Za-z0-9]/;
        const numberReg = /[0-9]/;

        data.upper = upperReg.test(password);
        data.lower = lowerReg.test(password); 
        data.symbol = symbolReg.test(password); 
        data.number = numberReg.test(password); 

        setPasswordData(data);
        if(data.upper && data.lower && data.symbol && data.number) return true;
        return false;
    }

    function switchPage(s){
        setSignUp(s);
        setResult(null);
    }

    useEffect(() => {
        checkPassword();
    }, [password])

    return(
        <div className="background">
            <div className="mainContainer">
                {signUp ? 
                // sign up
                <div>
                    <h2>Create an Account</h2>
                    <small style={{color:"grey"}}>Enter your details</small>
                    <br />
                    <br />
                    <form className="loginForm" onSubmit={(e) => signInNew(e)}>
                        <div className="formInputContainer">
                            <label htmlFor="name">Full Name</label>
                            <input className="formInput" id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required></input>
                        </div>
                        <br />
                        <div className="formInputContainer">
                            <label htmlFor="email">Email address</label>
                            <input className="formInput" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <br />
                        <div className="formInputContainer">
                            <label htmlFor="password">Password</label>
                            <input className="formInput" id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <ul className="passwordRequirements">
                                <li className={passwordData.upper && "checked"}>Uppercase Character</li>
                                <li className={passwordData.lower && "checked"}>Lowercase Character</li>
                                <li className={passwordData.symbol && "checked"}>Symbol</li>
                                <li className={passwordData.number && "checked"}>Number</li>
                            </ul>
                        </div>
                        <br />
                        {result && <small style={{color:"red"}}>{result.message}</small>}
                        <br />
                        {loading ? 
                        <Loading />
                        :
                        <div>
                            <button className="loginButton">Sign Up</button>
                            <br />
                            <br />
                            <div className="loginSwitch">Already have an account? <div onClick={() => switchPage(false)}>Sign In</div></div>
                        </div>
                        }
                    </form>
                </div>
                :
                // log in
                <div>
                    <h2>Log In</h2>
                    <small style={{color:"grey"}}>Enter your details</small>
                    <br />
                    <br />
                    <form className="loginForm" onSubmit={(e) => signIn(e)}>
                        <div className="formInputContainer">
                            <label htmlFor="email">Email address</label>
                            <input className="formInput" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <br />
                        <div className="formInputContainer">
                            <label htmlFor="password">Password</label>
                            <input className="formInput" id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        </div>
                        <br />
                        {result && <small style={{color:"red"}}>{result.message}</small>}
                        <br />
                        {loading ? 
                        <Loading />
                        :
                        <div>
                            <button className="loginButton">Sign In</button>
                            <br />
                            <br />
                            <div className="loginSwitch">Don't have an account? <div onClick={() => switchPage(true)}>Sign Up</div></div>
                        </div>
                        }
                    </form>
                </div>
                }
            </div>
        </div>
    );
}