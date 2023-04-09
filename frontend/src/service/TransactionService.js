import api from "./api";
import AuthService from "./AuthService";

const TransactionService = {

  upload: (file) => {
    const arquivo = new FormData();
    arquivo.append('file', file)

    return api.post(AuthService.host() + "/transaction/upload/", arquivo, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  allTransactions: () => {
    return api.get(AuthService.host() + "/transaction")
  },
  getTransaction: (id) => {
    return api.get(AuthService.host() + "/transaction/" +id)
  }
}

export default TransactionService;