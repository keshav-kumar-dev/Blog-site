import axios from "axios";
import { useDebugValue, useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useNavigate , Link} from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Signup = ()=>{

    const [userName, setUserName]  = useState("");
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [user, setUser]  = useState("");
     const [error, setError]  = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async(e)=>{
        try{

            e.preventDefault();
            setError("")
            
            const res = await axios.post(`${BASE_URL}/api/auth/register`,{
                name:userName,email,password
            },{withCredentials:true})

            dispatch(addUser(res.data))
            navigate("/")
        }
        catch(err){
            console.log(err.message)
            setError(err.message);
        }
    }

    return (

        <div className="flex items-center mt-20 flex-col">

            <div className="p-8 bg-orange-300 w-[40vw]  rounded-2xl">
            <h2 className="text-4xl mb-8 text-center">Sign Up</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-md">

                <div className=" flex flex-col space-y-2 p-4 ">
                    <label htmlFor="username" className=" text-4xl">Username :</label>
                    <input type="username" name="username" id="username" value={userName} onChange={(e)=>setUserName(e.target.value)} required placeholder="Enter your name"
                    className="border-2 p-2 rounded-sm"
                    />
                </div>

                <div className=" flex flex-col space-y-2 p-4 ">
                    <label htmlFor="email" className=" text-4xl">Email :</label>
                    <input type="email" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Enter your email"
                    className="border-2 p-2 rounded-sm"
                    />
                </div>

                <div className=" flex flex-col space-y-2 p-4 ">
                    <label htmlFor="password" className=" text-4xl">Password :</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Enter your password"
                    className="border-2 p-2 rounded-sm"
                    />
                </div>

                <div className="text-red-600">
                    {error}
                </div>
                <button type="submit" className="text-3xl bg-green-500 p-2 px-8 text-white m-4 rounded-md">SignUp</button>

            </form>
        <Link to={"/login"}> Click here of <span className="text-blue-700 underline">Login</span></Link>
            </div>
        </div>

    )
}

export default Signup;