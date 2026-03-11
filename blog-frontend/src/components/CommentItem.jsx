import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import CreateComment from "./CreteComment";
import { useState } from "react";

const CommentItem = ({commentData, level =0 })=>{

    const user = useSelector((store)=>store.user);
    const {text, _id, userId} = commentData;
    const [newCommentClick, setNewCommentClick] = useState(false)
    const [newText,setNewText] = useState("")
    const [editCommentClick,setEditCommentClick] = useState(false)

    const bgColors = [
        "bg-gray-200",
        "bg-white",
    ]

    const handleDelete = async(id)=>{
            try{
                const res = await axios.delete(`${BASE_URL}/api/blogs/comment/${id}`,{withCredentials:true})
                
            }catch(err){
                console.log(err.message)
            }
    }

    return (

        <div>

            <div className={`${bgColors[level % bgColors.length]} p-1 mb-4 px-4 rounded-md`}>
                        <div className="flex flex-row mb-1 justify-between">
                            <div className="flex flex-row">
                            <img src={userId?.photoURL} className="rounded-full w-6 h-6" alt="" />
                            <h6 className="mx-2">{userId?.name || "Unknown"} :</h6>
                            </div>
                            { (user?.user?.data?._id === userId?._id)? (<div>
                                <button className="underline mr-2" onClick={()=>handleDelete(_id)}>Delete</button>
                                <button className="underline" onClick={()=>setEditCommentClick(!editCommentClick)}>Edit</button>
                            </div>):(null)}
                        </div>
                        {editCommentClick && <CreateComment commentData={commentData}  editCommentClick = {editCommentClick} setEditCommentClick={setEditCommentClick}/>}
                        <p className="pl-4 mb-1 bg-white">{text}</p>
                        <button className="underline px-2" onClick={()=>setNewCommentClick(!newCommentClick)}> Reply</button>
                        {newCommentClick && <CreateComment commentData={commentData} setNewCommentClick={setNewCommentClick} />}
                    {   
                        commentData && commentData.replies?.map((ele)=>{
                        return <CommentItem commentData={ele} key={ele._id} level={level+1}/> })
                    }
            </div>

        </div>

    )
}

export default CommentItem;