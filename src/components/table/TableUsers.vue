<template>
  <div class="card">
    <FormSearch />
    <DataTable
      :value="userStore.state.lstUsers"
      :striped="true"
      :showGridlines="true"
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="website" header="WebSite" sortable></Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            @click="editUser(data)"
            class="p-button p-button-rounded"
            style="
              margin-right: 0.5em;
              color: white;
              background-color: #429488;
              border: 1px solid #429488;
              border-radius: 50%;
              width: 2em;
            "
          ></Button>
          <Button
            icon="pi pi-trash"
            @click="deleteUser(data)"
            class="p-button p-button-rounded"
            style="
              background-color: #d63864;
              color: white;
              border: 1px solid #d63864;
              border-radius: 50%;
              width: 2em;
            "
          ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import "primeicons/primeicons.css";
import { onMounted } from "vue";
import Swal from "sweetalert2";
const userStore = useStore();
const editUser = (user) => {
  userStore.dispatch("selectUser", user);
  userStore.dispatch("setOpenModal", true);
};
const deleteUser = (user) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, bórralo",
  }).then((result) => {
    if (result.isConfirmed) {
      userStore.dispatch("deleteUser", user.id);
      Swal.fire("Borrado", "El registro ha sido eliminado", "success");
    }
  });
};
onMounted(() => {
  userStore.state.lstUsers.length === 0 && userStore.dispatch("getLstUsers");
});
</script>
