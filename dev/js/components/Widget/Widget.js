import Multiselect from "../Multiselect/Multiselect";
import GetData from "./GetData/GetData";
import {widgetAPI} from "../../api/api";
import Loader from '../Loader/Loader.js';
import './Widget.scss';

const { defineComponent, reactive, ref, watch } = Vue;
const getData = new GetData();

export const Widget = defineComponent({
  components: {
    Multiselect,
    Loader,
  },
  name: 'widget',
  async setup() {
    const items = reactive([
      {
        name: 'Категории',
        nameInput: 'categories[]',
        value: categoriesDefaultSelected.length ? categoriesDefaultSelected : [],
        isSelected: !!categoriesDefaultSelected.length,
        options: [],
        placeholder: 'Выберите категорию',
      },
      {
        name: 'Продукты',
        nameInput: 'projects[]',
        value: productsDefaultSelected.length ? productsDefaultSelected : [],
        isSelected: !!productsDefaultSelected.length,
        options: [],
        placeholder: 'Выберите продукт',
      }
    ]);

    let select = ref(null);
    let selectAllBtn = ref(null);
    let loaderSettings = reactive({});

    await getData.init(items);

    const showLabels = (e, item) => {
      const arrEntries = Object.entries(item.value);
      const data = item.options;
      const values = data.filter((el) => arrEntries.find((item) => +item[1] === +el.value));

      return values.map((item) => item.label);
    };

    const watchOnSelect = (selected) => {
      if (selected?.isSelected) {
        selected?.selectAllBtn?.classList.add('hide');
      } else if (selected?.isSelected === false) {
        selected?.selectAllBtn?.classList.remove('hide');
      }
    }

    watch(() => items[0], watchOnSelect,
      {
        deep: true
      });

    watch(() => items[1], watchOnSelect,
      {
        deep: true
      });

    const selectAllItems = (e, item, index) => {
      select.value[index].selectAll();
      items[index].selectAllBtn = e.target;
      items[index].isSelected = true;
    }

    const clearSelect = (e, item, index) => {
      items[index].isSelected = false;
    };

    const selectOption = (e, item, index) => {
      items[index].selectAllBtn = selectAllBtn.value[index];
      items[index].isSelected = true;
    }

    const createLoader = (props) => {
      loaderSettings.target = props.loader;
      loaderSettings.target = props.loader;
      loaderSettings.showLoader = props.showLoader;
      loaderSettings.hideLoader = props.hideLoader;
    }

    const sendData = async (e) => {
      const t = e.target;

      let data = [];

      items[0].value.forEach((item) => {
        data.push(`${items[0].nameInput}=${item}`);
      });

      items[1].value.forEach((item) => {
        data.push(`${items[1].nameInput}=${item}`);
      });

      const send = new Promise((resolve) => {
          setTimeout(() => {
            widgetAPI.sendData(data);
            resolve();
          }, 1000);
      });

      const showLoader = setTimeout(() => {
        loaderSettings.showLoader(loaderSettings.target);
      }, 400);
      t.classList.add('no-active');

      send.then(() => {
        clearTimeout(showLoader);
        loaderSettings.hideLoader(loaderSettings.target);
        t.classList.remove('no-active');
      });
    };

    return {
      items,
      showLabels,
      selectAllItems,
      select,
      clearSelect,
      sendData,
      selectOption,
      selectAllBtn,
      createLoader,
    };
  },
  template: `
<div class="widget">
    <ul class="widget__items">
    <li class="widget-item" v-for="(item, index) of items">
      <h2 class="widget-item__title">{{item.name + ':'}}</h2>
      <div class="widget-item__wrapper select">
        <Multiselect mode="multiple" ref="select" v-model="item.value" :searchable="true" :options="item.options" :placeholder="item.placeholder" 
          :min-chars="0" :closeOnSelect="false" :hideSelected="false" :multipleLabel="(e) => showLabels(e, item)" @clear="(e) => clearSelect(e, item, index)" :resolve-on-load="false" :clear-on-search="true" @select="(e) => selectOption(e, item, index)"></Multiselect>
        <button v-show="!item.isSelected" type="button" ref="selectAllBtn" class="select__btn" @click="(e) => selectAllItems(e, item, index)">Все</button>
      </div>
     </li>
  </ul>
  <button @click="(e) => sendData(e)" class="widget__button" type="button">Отправить</button>
  <Loader @create-loader="createLoader"/>
</div>`,
});
