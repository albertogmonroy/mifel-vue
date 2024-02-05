import { createStore } from "vuex";
import { v4 as uuidv4 } from "uuid";
import axios from "./../config/axiosConfig";

const userStore = createStore({
  state: {
    lstUsers: [],
    openModal: false,
    userSelect: null,
  },
  mutations: {
    onLoadLstUsers(state, lstUsers) {
      state.lstUsers = lstUsers;
    },
    onAddUser(state, user) {
      state.lstUsers = [...state.lstUsers, user];
    },
    onDeleteUser(state, userId) {
      state.lstUsers = state.lstUsers.filter((user) => user.id !== userId);
    },
    onUpdateUser(state, user) {
      state.lstUsers = state.lstUsers.map((u) => (u.id === user.id ? user : u));
    },
    onOpenModal(state, openModal) {
      state.openModal = openModal;
    },
    onSelectUser(state, user) {
      state.userSelect = user;
    },
  },
  actions: {
    async getLstUsers({ commit }) {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_GET_API}users`
      );
      commit("onLoadLstUsers", data);
    },
    async addUser({ commit }, user) {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_POST_API}post`,
        user
      );

      const newUser = {
        id: uuidv4().split("-")[0],
        name: `${user.infoUsuario.nombre} ${user.infoUsuario.primerApellido} ${user.infoUsuario.segundoApellido}`,
        username: user.infoUsuario.nombre,
        email: `${user.infoUsuario.nombre}@mifel.com`,
        address: {
          street: user.Domicilio.calle,
          suite: user.Domicilio.numExt,
          city: user.Domicilio.estado,
          zipcode: user.Domicilio.cp,
          geo: { lat: "", lng: "" },
        },
        phone: "1234567890",
        website: `${user.infoUsuario.rfc}.com`,
        company: {
          name: "Mifel",
          catchPhrase: "Multi-layered client-server neural-net",
          bs: "harness real-time e-markets",
        },
      };
      commit("onAddUser", newUser);
    },
    selectUser({ commit }, user) {
      commit("onSelectUser", user);
    },
    editUser({ commit }, user) {
      commit("onUpdateUser", user);
    },
    deleteUser({ commit }, userId) {
      commit("onDeleteUser", userId);
    },
    setOpenModal({ commit }, openModal) {
      commit("onOpenModal", openModal);
    },
  },
});

export default userStore;
