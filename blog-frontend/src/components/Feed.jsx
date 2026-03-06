import axios from "axios";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import { Link } from "react-router-dom";

const Feed = ()=>{

    const user = useSelector((store)=>store.user);
   
    const [allPost , setAllPost] = useState("");
    const dispatch = useDispatch()

    const feedPosts = async()=>{
        try{
            const res = await axios.get("http://localhost:3000/api/blogs/",{withCredentials:true});
            setAllPost(res.data)
        }catch(err){
            console.log(err.message);
        }
    }

    const handleLogout =async ()=>{
        try{
            const res =await axios.post(`${BASE_URL}/api/auth/logout`, {}, {withCredentials:true})
            dispatch(removeUser());
        }catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        feedPosts();
    },[]);

    useEffect(()=>{
        // console.log(allPost,"State updated")
    },[allPost])

    return (
        <div className="w-full h-screen flex items-center flex-col">
            <nav className="bg-amber-400 w-full flex flex-row justify-between p-8">
               
                <h2 className="text-2xl pt-3 px-4 bg-white text-amber-800 rounded-2xl">Hello, {user?.user?.user?.name}</h2>
                <h1 className="text-4xl py-2 px-6 bg-white text-amber-800 rounded-2xl">Blog</h1>
               
              { (user?.user !== null)? (<div className=" flex items-center flex-row space-x-2">
                <Link to={"/create/blog"} className="text-2xl py-2 px-4 bg-white text-amber-800 rounded-2xl">Create Blog</Link>
                <button className="text-2xl py-2 px-4 bg-white text-amber-800 rounded-2xl" onClick={handleLogout}>Logout</button>
                </div>)
                :
                (<Link to={"/login"} className="text-2xl py-2 px-4 bg-white text-amber-800 rounded-2xl">Login</Link>)
            }
            </nav>
            <div className="px-2 md:px-0 md:w-[50%] flex justify-center items-center flex-col">

            {
                allPost && allPost.data.map((ele,key)=>{
                    return <PostCard key={key} postData={ele}/>
                })
            }
            </div>
        </div>
    )
}

export default Feed;