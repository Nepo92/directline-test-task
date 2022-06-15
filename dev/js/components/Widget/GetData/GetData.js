import {widgetAPI} from "../../../api/api";

class GetData {
  async init(items) {
    const categoriesData = new FormData();
    categoriesData.set('limit', '0');
    categoriesData.set('offset', '0');

    const projectsData = new FormData();
    projectsData.set('limit', '0');
    projectsData.set('offset', '0');

    const data = await widgetAPI.getData(categoriesData, projectsData);

    items.forEach((item, index) => {
      item.options = [...data[index].map((el) => {
        return {
          value: el.id,
          label: el.title,
        }
      })];
    });
  }
}

export default GetData;
