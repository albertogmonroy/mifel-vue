<template>
  <div class="card">
    <h2>Registro de usuarios</h2>
    <form @submit.prevent="handleNuevoSubmit" class="col-12 grid p-fluid">
      <div
        v-for="campo in camposFormulario"
        :key="campo.id"
        :class="['p-col', `col-${campo.ancho}`]"
      >
        <label
          :for="campo.id"
          :class="['floating-label', campo.labelClass]"
          style="display: flex; text-align: left"
        >
          {{ `${campo.etiqueta}:` }}
          <span :class="{ 'campo-obligatorio': campo.obligatorio }">
            {{ campo.obligatorio ? "*" : "" }}
          </span>
        </label>
        <InputText
          :id="campo.id"
          v-model="datosFormulario[campo.modelo]"
          :class="{ 'p-invalid': esCampoInvalido(campo.id) && mostrarErrores }"
          :required="campo.obligatorio"
          :keyfilter="campo.keyfilter"
          :maxlength="campo.maxlength || 100"
          class="p-inputtext"
        />
        <span
          v-if="esCampoInvalido(campo.id) && mostrarErrores"
          class="p-invalid"
          style="display: block; margin-top: 0.25rem; color: red"
        >
          {{ obtenerMensajeError(campo.id) }}
        </span>
      </div>
      <div class="flex w-full flex-wrap justify-content-center">
        <Button type="submit" label="Guardar" class="w-8rem" />
      </div>
    </form>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Swal from "sweetalert2";
import { camposFormulario, formatSaveUser, formatUpdateUser } from "./formData";

const userStore = useStore();
const datosFormulario = ref({
  nombre: "",
  primerApellido: "",
  segundoApellido: "",
  curp: "",
  rfc: "",
  cp: "",
  calle: "",
  numeroExterior: "",
  numeroInterior: "",
  estado: "",
  municipio: "",
  colonia: "",
});

const mostrarErrores = ref(false);
const erroresValidacion = ref({});
const RegexCurp =
  /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
const RegexRFC =
  /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;

const validarCampo = (campo) => {
  const valor = datosFormulario.value[campo.modelo];

  if (campo.obligatorio && (!valor || !valor.trim())) {
    erroresValidacion.value[campo.id] = campo.mensajeError;
  } else if (campo.id === "curp" && !RegexCurp.test(valor)) {
    erroresValidacion.value[campo.id] =
      "El CURP ingresado no tiene un formato válido.";
  } else if (campo.id === "rfc" && !RegexRFC.test(valor)) {
    erroresValidacion.value[campo.id] =
      "El RFC ingresado no tiene un formato válido.";
  } else if (
    campo.keyfilter instanceof RegExp &&
    valor &&
    !campo.keyfilter.test(valor)
  ) {
    erroresValidacion.value[
      campo.id
    ] = `El ${campo.etiqueta.toLowerCase()} ingresado no tiene un formato válido.`;
  } else {
    delete erroresValidacion.value[campo.id];
  }
};

const obtenerMensajeError = (idCampo) => {
  return erroresValidacion.value[idCampo];
};

const validarCampos = () => {
  erroresValidacion.value = {};

  camposFormulario.forEach((campo) => {
    validarCampo(campo);
  });
};

const esCampoInvalido = (idCampo) => {
  return !!erroresValidacion.value[idCampo];
};

const hayCampoInvalido = computed(() => {
  return Object.keys(erroresValidacion.value).length > 0;
});

const resetearFormulario = () => {
  datosFormulario.value = {};
  mostrarErrores.value = false;
  erroresValidacion.value = {};
};
const saveUsers = async (pUser) => {
  try {
    console.log("pUser:", pUser);
    await userStore.dispatch("addUser", pUser);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const handleNuevoSubmit = () => {
  validarCampos();
  if (!hayCampoInvalido.value) {
    const datosPost = { ...datosFormulario.value };
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Campos validados correctamente.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#4caf50",
      didClose: () => {
        if (userStore?.state?.userSelect) {
          const bodyUpdate = formatUpdateUser(datosPost, userStore.state.userSelect);
          userStore.dispatch("editUser", bodyUpdate);
          userStore.dispatch("setOpenModal", false);
          userStore.dispatch("selectUser", null);
        } else {
          const body = formatSaveUser(datosPost);
          saveUsers(body);
          resetearFormulario();
        }
      },
    });
  } else {
    mostrarErrores.value = true;
    const mensajesErrores = Object.values(erroresValidacion.value).join("<br>");
    Swal.fire({
      icon: "error",
      title: "Error",
      html: `<style>.swal2-container{z-index: 9999;}</style>
        Existen campos por validar. Por favor, verifica y completa los campos obligatorios.<br><br>
        <strong>Errores:</strong><br>${mensajesErrores}
        `,
    });
  }
};
if (userStore.state.userSelect) {
  const { name, username, address } = userStore.state.userSelect;
  Object.assign(datosFormulario.value, {
    nombre: name || "",
    primerApellido: name || "",
    segundoApellido: name || "",
    curp: username || "",
    rfc: username || "",
    cp: address.zipcode || "",
    calle: address.street || "",
    numeroExterior: address.suite || "",
    numeroInterior: address.suite || "",
    estado: address.city || "",
    municipio: address.city || "",
    colonia: address.city || "",
  });
}

watch(
  () => datosFormulario.value,
  () => {
    validarCampos();
  },
  { deep: true }
);
</script>

<style scoped>
.campo-obligatorio {
  color: red;
}
.p-field label {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
</style>
