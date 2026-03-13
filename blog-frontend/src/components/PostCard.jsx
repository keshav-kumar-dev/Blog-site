import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import {io} from "socket.io-client"
import Comment from "./Comment";

const PostCard = ({postData})=>{

    const [likesCount, setLikesCount] = useState(postData.likeCount);
    const [commentClick, setCommentClick] = useState(false);
    const [commentCount , setCommentCount]  = useState(postData.commentCount);

    
    const mediaURL = postData?.mediaURL ? `${BASE_URL}/uploads/${postData.mediaURL}`: null;

    
    useEffect(()=>{
        const socket = io(BASE_URL,{withCredentials:true});

        socket.on("updatedLikeCount", ({postId, likeCount})=>{
            if(postId === postData._id){
                setLikesCount(likeCount);
            }
        })

        socket.on("newComment",({postId,comment})=>{
            if(postId === postData._id){
            setCommentCount(commentCount=>commentCount+1)
            }
        })

        socket.on("commentOnComment", ({postId, comment})=>{
            if(postId === postData._id){
                setCommentCount(commentCount=>commentCount+1)
            }
        })


         socket.on("commentDeleted", ({postId,updatedPostCommentCount})=>{
            if(postId === postData._id){
                setCommentCount(updatedPostCommentCount);
            }
        })

        return ()=>{
            socket.disconnect();
        };

    },[])

    const handleLike = async(id)=>{
        
        const res = await axios.post(`${BASE_URL}/api/blogs/${id}/like`,{}, {
            withCredentials:true
        })
    }

    return (
        <div>
            {postData &&
            <div className="w-full md:w-[40vw] my-4 p-4 md:px-10 border-2 rounded-2xl space-y-4 ">
                <div>
                    <div className="bg-slate-200 p-3 rounded-tl-md rounded-tr-md flex flex-row mb-8">
                        <img src={postData.userId.photoURL} className="rounded-full w-10 h-10" alt="" />
                        <h3 className="text-3xl mx-2">{postData.userId.name}</h3>
                    </div>
                </div>
                <h1 className="text-center font-bold text-2xl">{postData.title}</h1>
                <p className="overflow-auto wrap-break-word">{postData.content}</p>
                <img src={mediaURL} alt="Media" className="h-[50%] md:h-[60vh] w-full object-cover"/>
                <div className="flex justify-between">

                <h5 className="border-2 border-black md:w-[20%]  text-center my-2 p-1 rounded-xl" onClick={()=>handleLike(postData._id)}> ❤️   {likesCount}</h5>
                <h5 className="border-2 border-black md:w-[40%]  text-center my-2 p-1 rounded-xl" onClick={()=>setCommentClick(!commentClick)}> Comment: {commentCount}</h5>
                </div>
                {
                    commentClick && <Comment postData={postData}/>
                }
            </div>

            }
        </div>
    )
}

export default PostCard;