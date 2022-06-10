<template>
  <div class="app">
    <h1 class="app__title">Приложение для получения категорий и продуктов</h1>
    <div class="app__wrapper">
      <div class="app__item">
        <h2 class="app-item__title">Категории</h2>
        <multiselect v-model="categoriesValue" :multipleLabel="() => [categoriesValue]"  mode="multiple" placeholder="Выберите категорию" :hideSelected="false" :searchable="true" :close-on-select="false" :options="categories"></multiselect>
      </div>
      <div class="app__item">
        <h2 class="app-item__title">Продукты</h2>
        <multiselect v-model="projectsValue" :multipleLabel="() => [projectsValue]" mode="multiple" :searchable="true" :hideSelected="false" :close-on-select="false" placeholder="Выберите продукт" :options="projects"></multiselect>
      </div>

      <button v-show="!hasData" class="app__btn" @click="getCategoriesAndProjects" type="button">Получить данные</button>
      <button v-show="hasData" class="app__btn" @click="getCategoriesAndProjects" type="button">Отправить</button>
    </div>
    <Loader @create-loader="createLoader"/>
  </div>
</template>

<script>
import './assets/scss/settings.scss';
import './assets/scss/select.scss';
import './assets/scss/grid.scss';

import { ref, watch } from "vue";

import { widgetAPI } from "../api/api";

import Loader from "./components/Loader/Loader.vue";

export default {
  components: {
    Loader,
  },
  setup() {
    let categories = ref([]);
    let projects = ref([]);
    let categoriesLimit = ref(0);
    let categoriesOffset = ref(0);
    let projectsLimit = ref(0);
    let projectsOffset = ref(0);
    let hasData = ref(false);

    let categoriesValue = ref([]);
    let projectsValue = ref([]);
    let loader;

    const getCategoriesAndProjects = async (e) =>  {
      const t = e.target

      const categoriesData = new FormData();
      categoriesData.set('limit', `${categoriesLimit.value}`);
      categoriesData.set('offset', `${categoriesOffset.value}`);

      const projectsData = new FormData();
      projectsData.set('limit', `${projectsLimit.value}`);
      projectsData.set('offset', `${projectsOffset.value}`);

      const loaderTimeout = setTimeout(() => {
        loader.classList.add('show');
      }, 400);

      t.classList.add('no-active');

      const getData = await widgetAPI.getData(categoriesData, projectsData);

      t.classList.add('no-active');
      clearTimeout(loaderTimeout);
      loader.classList.remove('show');
      t.classList.remove('no-active');

      const [categoriesResponse, projectsResponse] = getData;

      categories.value = categoriesResponse.data.message.data.map((item) => item.title);
      projects.value = projectsResponse.data.message.data.map((item) => item.title);

      hasData.value = true;
    }

    const createLoader = (loaderItem) => {
      loader = loaderItem;
    };

    watch(hasData, () => {
      console.log(projects.value);
      console.log(categories.value);
    });

    return {
      categories,
      projects,
      categoriesValue,
      projectsValue,
      getCategoriesAndProjects,
      createLoader,
      hasData,
    }
  }
}
</script>
