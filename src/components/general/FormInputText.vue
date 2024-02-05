<template>
  <div class="p-float-label">
    <InputText
      v-model="value"
      class="p-d-block"
      :class="{ 'p-invalid': v$.value.$error }"
      :placeholder="label"
      :disabled="disabled"
      :maxlength="maxLength"
      :keyfilter="keyfilter"
      :aria-labelledby="labelId"
    />
    <label :for="labelId" class="ml-2 -mt-4">{{ label }}</label>
    <small class="p-error" v-if="v$.value.$error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import InputText from 'primevue/inputtext';
export default {
  name: "FormInputText",
  props: {
    name: { type: String, required: Boolean },
    label: { type: String, required: Boolean },
    className: String,
    values: String,
    isrequired: Boolean,
    maxLength: Number,
    keyfilter: String,
    rules: Object,
  },
  setup(props) {
    const value = ref(props.values || "");
    const v$ = useVuelidate({
      value: {
        value: value,
        rules: {
          required: props.isrequired ? required : null,
          maxLength: props.maxLength ? maxLength(props.maxLength) : null,
        },
      },
    });
    const errorMessage = computed(() => {
      if (v$.value.$error) {
        return Object.values(v$.value.$errors)[0].$message;
      }
      return "";
    });
    return {
      value,
      v$,
      errorMessage,
    };
  },
};
</script>

<style scoped></style>
