    import axios from "axios";
    import { useDebugValue, useState } from "react";
    import { BASE_URL } from "../utils/constant";
    import { useNavigate } from "react-router-dom";
    import { useDispatch } from "react-redux";
    import { addUser } from "../utils/userSlice";

const CreateBlog = ()=>{
        
        const [title, setTitle]  = useState("");
        const [content, setContent]  = useState("");
        const [media, setMedia]  = useState("");
        const [user, setUser]  = useState("");
         const [error, setError]  = useState("");
        const navigate = useNavigate();
        const dispatch = useDispatch();
    
        const handleSubmit = async(e)=>{
            try{
    
                e.preventDefault();
                setError("")

                const formData = new FormData();
                formData.append("title",title);
                formData.append("content",content);
                formData.append("Uploaded_file_name",media);
                
                const res = await axios.post(`${BASE_URL}/api/blogs/`,formData,
                    {withCredentials:true,
                     headers:{
                            "Content-Type" :"multipart/form-data"
                        }
                    })

                navigate("/")
            }
            catch(err){
                if (err.response) {
                    setError(err.response.data.error);
                } else {
                    // If there's no response, display a generic message
                    setError("Something went wrong, please try again.");
                }
            }
        }
    

    return (

          <div className="flex items-center mt-20 flex-col">

            <div className="p-8 bg-orange-300 md:w-[40vw]  rounded-2xl">
            <h2 className="text-4xl mb-8 text-center">Create New Blog</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-md">

                <div className=" flex flex-col space-y-2 p-4 ">
                    <label htmlFor="title" className=" text-4xl">Title :</label>
                    <input type="title" name="title" id="title" value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Enter title"
                    className="border-2 p-2 rounded-sm"
                    />
                </div>

                <div className=" flex flex-col space-y-2 p-4 ">
                    <label htmlFor="content" className=" text-4xl">Description :</label>
                    <textarea
                    name="content"
                    id="content"
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                    className="border-2 p-2 rounded-sm h-[30vh]"
                    ></textarea>
                </div>

                <div className=" flex flex-col space-y-2 p-4 ">
                    <label htmlFor="blogmedia" className=" text-4xl">Media :</label>
                    <input
                        type="file"
                        name="blogmedia"
                        id="blogmedia"
                        onChange={(e)=>setMedia(e.target.files[0])}
                        className="border-2 p-2 rounded-sm"
                        />
                </div>

                <div className="text-red-600 ml-4">
                    {error}
                </div>
                <button type="submit" className="text-3xl bg-green-500 p-2 px-8 text-white m-4 rounded-md">Post</button>

            </form>

            </div>
        </div>


    )

}

export default CreateBlog;