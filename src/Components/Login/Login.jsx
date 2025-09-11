import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaLockOpen } from "react-icons/fa";
import firebase from "../../plugins/Firebase";

function Login() {
  const [email, setEmail] = useState("root@pucpr.edu.br");
  const [senha, setSenha] = useState("123456");
  const [feedback, setFeedback] = useState({ texto: "", tipo: "" });
  const [carregar, setCarregar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  async function autenticar(evento) {
    evento.preventDefault();
    if (carregar) return;
    try {
      setCarregar(true);
      await firebase.auth().signInWithEmailAndPassword(email, senha);
      setFeedback({ texto: "Usuário autenticado com sucesso!", tipo: "success" });
      setTimeout(() => navigate("/Principal", { replace: true }), 600);
    } catch (error) {
      setFeedback({ texto: "Usuário ou senha incorretos!", tipo: "error" });
      console.error(error);
    } finally {
      setCarregar(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <div className="formulario">
          <h1>Login</h1>

          <div className="input-box">
            <input type="email" placeholder="Email" name="email" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input type={mostrarSenha ? "text" : "password"} placeholder="Senha" name="password" value={senha}
              onChange={(e) => setSenha(e.target.value)} required />
            {mostrarSenha ?
              <FaLockOpen className="icon toggle-senha" onClick={() => setMostrarSenha(false)} />
              :
              <FaLock className="icon toggle-senha" onClick={() => setMostrarSenha(true)} />
            }
          </div>

          <button onClick={autenticar}>Acessar</button>

          {feedback.texto && <label className={`feedback ${feedback.tipo}`}>{feedback.texto}</label>}

          <div className="register-link">
            <p>Ainda não tem uma conta? <Link to="/Cadastrar">Cadastrar</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
