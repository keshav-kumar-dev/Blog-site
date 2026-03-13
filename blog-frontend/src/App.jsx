import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FeedRoute from "./components/Feed"
import LoginRoute from "./auth/Login";
import SignupRoute from "./auth/Signup";
import {Provider} from "react-redux"
import appStore from "./utils/appStore";
import CreateBlogRoute from "./components/CreateBlog";
import { Toaster } from "react-hot-toast";

const App = ()=>{

  return (
    <Provider store={appStore}>
        <Toaster position="top-center" />
    <BrowserRouter > 
      <Routes>
        <Route path="/" element={<FeedRoute/>}></Route>
        <Route path="/login" element={<LoginRoute/>}></Route>
        <Route path="/signup" element={<SignupRoute/>}></Route>
        <Route path="/create/blog" element={<CreateBlogRoute/>}></Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App;