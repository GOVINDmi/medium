import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from "./pages/Blogs";
import { Publish } from './pages/Publish';
import {MyProfile} from './pages/MyProfile';
import NotificationsPage from "./pages/Notification"
import {ProfilePage} from "./pages/Profile";
import { MyProfileBlog } from './pages/MyProfileBlog';
import  Update  from './pages/Update';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/myprofile" element={<MyProfile/>}/>
          <Route path="/notifications" element={<NotificationsPage/>}/>
          <Route path="/profile/:id" element={<ProfilePage/>}/>
          <Route path='/myprofileblog/:id' element={<MyProfileBlog/>}/>
          <Route path='/update/:id' element={<Update/>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App