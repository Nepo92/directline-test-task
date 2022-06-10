<template>
  <div ref="loader" class="loader"></div>
</template>

<script>
import './Loader.scss';
import {onMounted, ref} from "vue";

export default {
  setup(props, { emit }) {
    let loader = ref({});

    onMounted(() => {
      emit('create-loader', loader.value);
    })

    return {
      loader,
    }
  }
}
</script>
