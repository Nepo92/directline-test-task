<template>
  <div class="app">
    <h1 class="app__title">Виджет для получения категорий и продуктов</h1>
    <div class="app__wrapper">
      <ul class="app__selects">
        <li class="app-selects__item select-item" ref="categoriesSelect">
          <h2 class="select-item__title">Категории</h2>
          <div class="select-item__wrapper">
              <multiselect ref="categoriesSelectSettings" v-model="categoriesValue" :multipleLabel="() => showSelectValues(categoriesValue, 'categories')"  mode="multiple" placeholder="Выберите категорию" :hideSelected="false" :searchable="true"  :close-on-select="false" :options="categories"></multiselect>
            <button class="select-item__btn" v-show="hasData" @click="selectAllCategories">Выбрать все</button>
          </div>
        </li>
        <li class="app-selects__item select-item">
          <h2 class="select-item__title">Продукты</h2>
          <div class="select-item__wrapper">
              <multiselect ref="productsSelectSettings" v-model="projectsValue" :multipleLabel="() => showSelectValues(projectsValue, 'projects')" mode="multiple" :searchable="true" :hideSelected="false" :close-on-select="false" placeholder="Выберите продукт" :options="projects"></multiselect>
            <button class="select-item__btn" v-show="hasData" @click="() => selectAllProducts()">Выбрать все</button>
          </div>
        </li>
      </ul>

      <button v-show="!hasData" class="app__btn" @click="getCategoriesAndProjects" type="button">
        Получить данные
      </button>
    </div>
    <Loader @create-loader="createLoader"/>
  </div>
</template>

<script>
import './assets/scss/settings.scss';
import './assets/scss/select.scss';
import './assets/scss/grid.scss';
import './App.scss';

import {ref, watch, reactive, onMounted} from "vue";
import { widgetAPI } from "../api/api";

import Loader from "./components/Loader/Loader.vue";

export default {
  components: {
    Loader,
  },
  setup() {
    let categories = ref([]);
    let projects = ref([]);
    let categoriesLimit = ref(15);
    let categoriesOffset = ref(0);
    let projectsLimit = ref(0);
    let projectsOffset = ref(0);
    let hasData = ref(false);
    let categoriesSelect = ref({});
    let specOption = ref({});
    let bodySelect = ref({});
    let categoriesSelectSettings = ref({});
    let productsSelectSettings = ref({});

    let categoriesValue = ref([]);
    let projectsValue = ref([]);

    let loader;
    let categoriesOptionsCount = 15;

    const getPayloadData = () => {
      const categoriesData = new FormData();
      categoriesData.set('limit', `${categoriesLimit.value}`);
      categoriesData.set('offset', `${categoriesOffset.value}`);

      const projectsData = new FormData();
      projectsData.set('limit', `${projectsLimit.value}`);
      projectsData.set('offset', `${projectsOffset.value}`);

      return [categoriesData, projectsData];
    }

    const updateLinks = async (categoriesResponse, projectsResponse = null) => {
      const response = categoriesResponse.data.message.data.map((item) => {
        return {
          label: item.title,
          value: item.id
        }
      });

      categories.value = [categories.value, ...response];

      if (projectsResponse) {
        projects.value = [...projectsResponse.data.message.data.map((item) => {
          return {
            label: item.title,
            value: item.id,
          }
        })];
      }

      hasData.value = await true;
    }

    const changeOffset = () => {
      categoriesOffset.value = categoriesLimit.value;
      categoriesLimit.value = categoriesLimit.value + categoriesOptionsCount;
    }

    const getSpecOption = () => {
      return Array.from(bodySelect.value.children).at(-8);
    }

    const getCategoriesBodySelect = () => {
      return Array.from(Array.from(categoriesSelect.value.children).at(-1).children[0].children).at(-2).children[0];
    }

    const getCategoriesAndProjects = async (e) =>  {
      const t = e.target

      const loaderTimeout = setTimeout(() => {
        loader.classList.add('show');
      }, 400);

      t.classList.add('no-active');

      const [categoriesData, projectsData] = getPayloadData();

      const getData = await widgetAPI.getData(categoriesData, projectsData);

      t.classList.add('no-active');
      clearTimeout(loaderTimeout);
      loader.classList.remove('show');
      t.classList.remove('no-active');

      const [categoriesResponse, projectsResponse] = getData;

      updateLinks(categoriesResponse, projectsResponse).then(() => {
        bodySelect.value = getCategoriesBodySelect();

        specOption.value = getSpecOption();
        changeOffset();
      });
    }

    const lazyLoad = async () => {
      const [categoriesData] = getPayloadData();

      const loaderTimeout = setTimeout(() => {
        loader.classList.add('show');
      }, 400);

      const categoriesResponse = await widgetAPI.getCategories(categoriesData);

      clearTimeout(loaderTimeout);
      loader.classList.remove('show');

      updateLinks(categoriesResponse).then(() => {
        specOption.value = getSpecOption();

        changeOffset();
      });
    }

    watch(specOption, () => {
      const options = {
        rootMargin: '0px',
        threshold: 1.0
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          lazyLoad();
        }
      }, options);

      if (specOption.value) {
        observer.observe(specOption.value);
      }
    })

    const createLoader = (loaderItem) => {
      loader = loaderItem;
    };

    const showSelectValues = (arr, selectName) => {
      const arrEntries = Object.entries(arr);

      const data = selectName === 'categories' ? categories.value : projects.value;

      const values = data.filter((el) => arrEntries.find((item) => +item[1] === +el.value));

      return values.map((item) => item.label);
    };

    const selectAllCategories = () => {
      categoriesSelectSettings.value.selectAll();
    };

    const selectAllProducts = () => {
      productsSelectSettings.value.selectAll();
    }

    return {
      categories,
      projects,
      categoriesValue,
      projectsValue,
      getCategoriesAndProjects,
      createLoader,
      hasData,
      showSelectValues,
      categoriesSelect,
      categoriesSelectSettings,
      selectAllCategories,
      productsSelectSettings,
      selectAllProducts,
    }
  }
}
</script>
