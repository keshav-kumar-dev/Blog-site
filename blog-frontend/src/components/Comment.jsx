import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { use, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {io} from "socket.io-client"

const Comment = ({postData})=>{

    const [allComments, setAllComments] = useState([]);
    const [newCommentClick, setNewCommentClick] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");
    const user = useSelector((store)=>store.user);
  
    // console.log(user)

    const fetchComment = async()=>{
        const res = await axios.get(`${BASE_URL}/api/blogs/${postData._id}/comment`,{withCredentials:true});
        setAllComments(res?.data?.data);
    }
    
    const handleCommentSubmit = async(e)=>{
        e.preventDefault()
        const res = await axios.post(`${BASE_URL}/api/blogs/${postData._id}/comment`,{
            text:newCommentText
        },{
            withCredentials:true
        })
        setNewCommentText("");
        setNewCommentClick(false);
    }

    const handleDelete = async(id)=>{
        try{
            const res = await axios.delete(`${BASE_URL}/api/blogs/comment/${id}`,{withCredentials:true})
            console.log(res)

            
        }catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        const socket = io(BASE_URL,{withCredentials:true});

        socket.on("newComment", ({ postId, comment})=>{
            if(postId === postData._id){
            setAllComments(allComments => [comment,...allComments]);
        }
        })
        socket.on("commentDeleted", ({postId,commentId})=>{
            if(postId === postData._id){

                setAllComments(prevComments => prevComments.filter(ele=>ele._id !== commentId));
            }
        })
        
    },[])

    useEffect(()=>{
        fetchComment();
    },[postData._id])

    return (

        <div className="border-2 border-black rounded-xl p-2">
            <div className="flex justify-between mb-2">
            <h1 className="text-xl">Comments : </h1>
            <button className="underline" onClick={()=>setNewCommentClick(!newCommentClick)}>New Comment</button>
            </div>
            {newCommentClick && <form onSubmit={handleCommentSubmit} className="w-full bg-slate-100 my-2 p-2">
                <div className="">{user?.user?.user?.name}</div>
                <textarea name="commettext" value={newCommentText} onChange={(e)=>setNewCommentText(e.target.value)} className="w-full border-1 p-2" placeholder="Write your comment...."></textarea>
                <button type="submit" className="bg-green-700 p-1 px-2 rounded-md text-white">Comment</button>
            </form>}
            {
                allComments.map((ele,key)=>{
                    console.log(ele)
                    return <div key={key} className="bg-slate-200 p-1 mb-1 px-4 rounded-md">
                        <div className="flex flex-row mb-1 justify-between">
                            <div className="flex flex-row">
                            <img src={postData.userId.photoURL} className="rounded-full w-6 h-6" alt="" />
                            <h6 className="mx-2">{ele.userId?.name || "Unknown"} :</h6>
                            </div>
                            { (user?.user?.user?._id === ele.userId._id)? (<div>
                                <button className="underline mr-2" onClick={()=>handleDelete(ele._id)}>Delete</button>
                                <button className="underline">Edit</button>
                            </div>):(null)}
                        </div>
                        <p className="pl-4 mb-1 bg-white">{ele.text}</p>
                    </div>
                })
            }
        </div>
    )
}

export default Comment;