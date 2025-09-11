import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Components/Login/Login";
import Cadastrar from "../Components/Cadastrar/Cadastrar";
import Principal from "../Components/Principal/Principal";

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
      </Routes>
    </BrowserRouter>
  );
}
