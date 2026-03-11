import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";

const CreateComment = ({
  commentData,
  setNewCommentClick,
  editCommentClick,
  setEditCommentClick
}) => {

  const [newCommentText, setNewCommentText] = useState(editCommentClick?commentData.text:"");
  const user = useSelector((store) => store.user);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (setNewCommentClick) {
      const res = await axios.post(
        `${BASE_URL}/api/blogs/${commentData.postId}/comment/${commentData._id}`,
        {
          text: newCommentText,
        },
        {
          withCredentials: true,
        },
      );

      setNewCommentClick(false);
    } else if (editCommentClick) {
      const res = await axios.patch(
        `${BASE_URL}/api/blogs/comment/${commentData._id}`,
        {
          text: newCommentText,
        },
        {
          withCredentials: true,
        },
      );
      setEditCommentClick(false);
    }
    setNewCommentText("");
    
  };

  return (
    <div>
      <form
        onSubmit={handleCommentSubmit}
        className="w-full bg-white my-2 p-2"
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
    </div>
  );
};

export default CreateComment;
