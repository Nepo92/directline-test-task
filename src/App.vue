<template>
    <div class="wrapper">
      <Suspense>
        <Nested/>
      </Suspense>
    </div>
</template>

<script>
import Nested from "./components/WidgetContainer/WidgetNested.vue";

export default {
  components: {
    Nested,
  },
}

</script>
