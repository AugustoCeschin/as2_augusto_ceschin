import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaLockOpen, FaCalendarAlt } from "react-icons/fa";
import firebase from "../../plugins/Firebase";

function Cadastrar() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [feedback, setFeedback] = useState({ texto: "", tipo: "" });
  const [carregar, setCarregar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const dateRef = useRef(null);
  const navigate = useNavigate();

  const abrirCalendario = () => {
    if (dateRef.current?.showPicker) dateRef.current.showPicker();
    else dateRef.current?.focus();
  };

  async function cadastrar(evento) {
    evento.preventDefault();
    if (carregar) return;

    try {
      setCarregar(true);

      const cadastro = await firebase.auth().createUserWithEmailAndPassword(email, senha);

      await firebase.firestore().collection("usuarios").doc(cadastro.user.uid).set({
        nome,
        sobrenome,
        dataNascimento,
        email,
      });

      setFeedback({ texto: "Cadastro salvo com sucesso!", tipo: "success" });
      setTimeout(() => navigate("/", { replace: true }), 600);
    } catch (error) {
      console.error(error);
      setFeedback({ texto: "Falha ao salvar, tente novamente.", tipo: "error" });
    } finally {
      setCarregar(false);
    }
  }

  return (
    <div className="wrapper">
      <div className="form-box">
        <div className="formulario">
          <h1>Cadastrar</h1>

          <div className="input-box">
            <input type="text" placeholder="Nome" name="nome" value={nome}
              onChange={(e) => setNome(e.target.value)} required autoFocus />
          </div>

          <div className="input-box">
            <input type="text" placeholder="Sobrenome" name="sobrenome" value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)} required />
          </div>

          <div className="input-box">
            <input ref={dateRef} type="date" name="dataNascimento" value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)} required />
            <FaCalendarAlt className="icon toggle-data" onClick={abrirCalendario} />
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" name="email" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
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

          <button onClick={cadastrar} disabled={carregar}>
            {carregar ? "Salvando..." : "Cadastrar"}
          </button>

          {feedback.texto && (<label className={`feedback ${feedback.tipo}`}>{feedback.texto}</label>)}

          <div className="register-link">
            <p>Já tem uma conta? <Link to="/">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastrar;
