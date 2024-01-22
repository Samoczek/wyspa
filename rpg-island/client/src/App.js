import Home from './pages/Home'
import Registration from './pages/Registration'
import Profile from './pages/Profile'
import Annoucements from './pages/Annoucements'
import AddAnnoucement from './pages/AddAnnoucement'
import EditInfo from './pages/EditInfo'
import MyAnnoucements from './pages/MyAnnoucements.js'
import ApplicantsList from './pages/ApplicantsList'
import Chat from './pages/Chat';
import MyApplications from './pages/MyApplications.js'
import EditPost from './pages/EditPost.js'
import AdminPanel from './pages/AdminPanel.js'
import UsersPanel from './pages/UsersPanel.js'



import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
 <BrowserRouter>
 <Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/registration" element={<Registration/>}/>
  <Route path="/profile" element={<Profile/>}/>
  <Route path="/annoucements" element={<Annoucements/>}/>
  <Route path="/editinfo" element={<EditInfo/>}/>
  <Route path="/addAnnoucement" element={<AddAnnoucement/>}/>
  <Route path="/myAnnoucements" element={<MyAnnoucements/>}/>
  <Route path="/applicantsList/:postId" element={<ApplicantsList/>} />
  <Route path="/chat/:userId" element={<Chat/>} />
  <Route path="/myApplications" element={<MyApplications/>} />
  <Route path="/editPost/:postId" element={<EditPost/>} />
  <Route path="/adminpanel" element={<AdminPanel/>} />
  <Route path="/userspanel" element={<UsersPanel/>} />
  
  
 </Routes>
 </BrowserRouter>
  )
}

export default App;

