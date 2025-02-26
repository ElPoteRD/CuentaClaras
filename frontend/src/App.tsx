import { Route, Routes } from "react-router-dom"
import { Toaster } from 'sonner';
import Home from "./page/home/Home"
import Login from "./page/login/Login"
import Register from "./page/register/Register"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
