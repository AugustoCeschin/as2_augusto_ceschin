import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../../plugins/Firebase";

function Principal() {
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();

  const formatarData = (data) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (usuario) => {
      try {
        if (!usuario) {
          await firebase.auth().signOut();
          navigate("/", { replace: true });
          return;
        }

        const retorno = await firebase.firestore().collection("usuarios").doc(usuario.uid).get();
        if (!retorno.exists) return;

        const data = retorno.data() ?? {};
        setDados({
          nome: data.nome ?? "",
          sobrenome: data.sobrenome ?? "",
          email: data.email ?? "",
          dataNascimento: data.dataNascimento ? formatarData(data.dataNascimento) : "",
        });
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const desconectar = async () => {
    try {
      await firebase.auth().signOut();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Erro ao deslogar:", e);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <div className="formulario">
          <h1>Olá, {dados?.nome} {dados?.sobrenome}</h1>

          <div className="listaDados">
            <p><strong>Email:</strong> {dados?.email}</p>
            <p><strong>Data de Nascimento:</strong> {dados?.dataNascimento}</p>
          </div>

          <button onClick={desconectar}>Sair</button>

        </div>
      </div>
    </div>
  );
}

export default Principal;
