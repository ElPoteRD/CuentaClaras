import { Route, Routes } from "react-router-dom"
import { Toaster } from 'sonner';
import Home from "./page/home/Home"
import Login from "./page/login/Login"
import Register from "./page/register/Register"
import Dashboard from "./page/dashboard/Dashboard";
import Account from "./page/account/Account";
import Profile from "./page/profile/Profile"
import Income from "./page/income/Income";
import Expense from "./page/expense/Expense";
import Reporte from "./page/reports/Report";
import Configuration from "./page/configuration/Configuration";
import Caracteristcas from "./components/caracteristica";
import { AccountDetail } from "./page/account/[id]/page";
import { About } from "./components/about";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/account" element={<Account />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/income" element={<Income />}></Route>
        <Route path="/expense" element={<Expense />}></Route>
        <Route path="/report" element={<Reporte />}></Route>
        <Route path="/configuration" element={<Configuration />}></Route>
        <Route path="/caracteristicas" element={<Caracteristcas />}></Route>
        <Route path="/account/:id" element={<AccountDetail />}></Route>
        <Route path="/about" element={<About />}></Route>


      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
