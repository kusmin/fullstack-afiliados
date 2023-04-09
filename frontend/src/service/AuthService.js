import axios from "axios";

const AuthService = {
  usuarioCorrente: () => {
    let conteudo = localStorage.getItem("user");
    if (conteudo) {
      return JSON.parse(conteudo);
    } else {
      return null;
    }
  },

  setUsuarioCorrente: (usuario) => {
    localStorage.setItem("user", JSON.stringify(usuario));
  },

  removeUsuarioCorrente: () => {
    localStorage.removeItem("user");
  },

  token: () => {
    let corrente = AuthService.usuarioCorrente();
    if (corrente) {
      return corrente.access_token;
    } else {
      return null;
    }
  },

  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
  },

  auth: (credenciais) => {
    return axios.post(
      import.meta.env.VITE_HOST_API + "/auth/login",
      credenciais
    );
  },

  register: (user) => {
    return axios.post(
      import.meta.env.VITE_HOST_API + "/auth/register",
      user
    );
  },

  host: () => {
    return import.meta.env.VITE_HOST_API;
  },
};

export default AuthService;
