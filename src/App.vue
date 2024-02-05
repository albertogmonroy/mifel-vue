<template>
  <div v-if="userStore.state.openModal">
    <div class="flex w-full flex-wrap justify-content-center">
      <Button
        label="Ver Registros"
        icon="pi pi-users"
        @click="setView(false)"
        type="button"
      ></Button>
    </div>
    <FormUsers />
  </div>
  <div v-if="!userStore.state.openModal">
    <div class="flex w-full flex-wrap justify-content-center">
      <Button
        icon="pi pi-plus"
        label="Nuevo Registro"
        @click="setView(true)"
        type="button"
      ></Button>
    </div>
    <TableUsers />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import FormUsers from "./components/form/FormUsers.vue";
import TableUsers from "./components/table/TableUsers.vue";
import Button from "primevue/button";

const userStore = useStore();
const setView = (value) => {
  userStore.dispatch("setOpenModal", value);
};
console.log(userStore.state.openModal);
</script>
