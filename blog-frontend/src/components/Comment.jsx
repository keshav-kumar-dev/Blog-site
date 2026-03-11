import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { use, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import CommentItem from "./CommentItem";

const Comment = ({ postData }) => {
  const [allComments, setAllComments] = useState([]);
  const [newCommentClick, setNewCommentClick] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const user = useSelector((store) => store.user);

  const fetchComment = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/blogs/${postData._id}/comment`,
      { withCredentials: true },
    );
    console.log("All commets:",res?.data?.data)
    setAllComments(res?.data?.data);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if(!user.user){
      alert("Login for comment")
    }
    const res = await axios.post(
      `${BASE_URL}/api/blogs/${postData._id}/comment`,
      {
        text: newCommentText,
      },
      {
        withCredentials: true,
      },
    );
    setNewCommentText("");
    setNewCommentClick(false);
  };

  const addReply = (prevComments, newComment)=>{
        
    return prevComments.map((ele)=>{
            
      if(ele._id === newComment.parentCommentId._id){
        return {...ele, replies: [newComment,...ele.replies||[],]}
      }

      if(ele.replies?.length){
        return {
          ...ele,
          replies : addReply(ele.replies,newComment )
        }
      }

      return ele;
    })
  }

  const removeComment = (comments, parentPath) =>{
    return comments
    .filter((c) => c.parentPath !== parentPath)
    .map((c) => ({
      ...c,
      replies: removeComment(c.replies || [], parentPath)
    }));
}

  useEffect(() => {
    
    const socket = io(BASE_URL, { withCredentials: true });

    socket.on("newComment"  , ({ postId, comment }) => {
      if (postId === postData._id) {
        setAllComments((prev) => [comment, ...prev]);
      }
    });

    socket.on("updatedComment", ({ updatedComment }) => {

        setAllComments((prevComments) =>{
            return prevComments.map((ele) => {
                return (ele._id === updatedComment._id)? {...ele,text :updatedComment.text} : ele;
        })});
    });

    socket.on("commentOnComment", ({postId, comment})=>{
      if(postId === comment.postId){
      setAllComments((prevComments)=>addReply(prevComments,comment));}
    })

    socket.on("commentDeleted", ({ postId, parentPath}) => {
      if (postId === postData._id) {
        setAllComments((prev) => removeComment(prev, parentPath));
      }
    });
  }, [postData._id]);

  useEffect(() => {
    fetchComment();
  }, [postData._id]);

  return (
    <div className="border-2 border-black rounded-xl p-2">
      <div className="flex justify-between mb-2">
        <h1 className="text-xl">Comments : </h1>
        <button
          className="underline"
          onClick={() => setNewCommentClick(!newCommentClick)}
        >
          New Comment
        </button>
      </div>
      {newCommentClick && (
        <form
          onSubmit={handleCommentSubmit}
          className="w-full bg-slate-100 my-2 p-2"
        >
          <div className="">{user?.user?.data?.name}</div>
          <textarea
            name="commettext"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border-1 p-2"
            placeholder="Write your comment...."
          ></textarea>
          <button
            type="submit"
            className="bg-green-700 p-1 px-2 rounded-md text-white"
          >
            Comment
          </button>
        </form>
      )}

      {allComments.map((ele, key) => {
        return <CommentItem commentData={ele} key={key} />;
      })}
    </div>
  );
};

export default Comment;
