<template>

</template>

<script>
import {reactive} from "vue";
import {widgetAPI} from "../../../api/api";

export default {
  async setup() {
    let categories = reactive({});
    let projects = reactive({});

    const categoriesData = new FormData();
    categoriesData.set('limit', '0');
    categoriesData.set('offset', '0');

    const projectsData = new FormData();
    projectsData.set('limit', '0');
    projectsData.set('offset', '0');

    const getData = await widgetAPI.getData(categoriesData, projectsData);

    categories = getData[0].data.message.data;
    projects = getData[1].data.message.data;

    return {
      categories,
      projects,
    }
  }
}
</script>

<style scoped>

</style>