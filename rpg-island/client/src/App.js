import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Registration from './pages/Registration'
import Profile from './pages/Profile'
import Annoucements from './pages/Annoucements'
import AddAnnoucement from './pages/AddAnnoucement'
import EditInfo from './pages/EditInfo'
import MyAnnoucements from './pages/MyAnnoucements.js'
import ApplicantsList from './pages/ApplicantsList'
import Chat from './pages/Chat';


import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
 <BrowserRouter>
 <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/dashboard" element={<Dashboard/>}/>
  <Route path="/registration" element={<Registration/>}/>
  <Route path="/profile" element={<Profile/>}/>
  <Route path="/annoucements" element={<Annoucements/>}/>
  <Route path="/editinfo" element={<EditInfo/>}/>
  <Route path="/addAnnoucement" element={<AddAnnoucement/>}/>
  <Route path="/myAnnoucements" element={<MyAnnoucements/>}/>
  <Route path="/applicantsList/:postId" element={<ApplicantsList/>} />
  <Route path="/chat/:userId" element={<Chat/>} />
  
  
 </Routes>
 </BrowserRouter>
  )
}

export default App;

