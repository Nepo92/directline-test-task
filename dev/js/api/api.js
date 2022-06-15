import axios from 'axios';

export const widgetAPI = {
  config: {
    headers: { Authorization: 'Bearer BT3HK2NpCnyrKiDo', },
  },
  async getCategories(formData) {
    const request = await axios.post('https://lobster.tools/api/v1/categories', formData, this.config);

    return JSON.parse(JSON.stringify(request)).data.message.data;
  },
  async getProjects(formData) {
    const request = await axios.post('https://lobster.tools/api/v1/projects', formData, this.config);

    return JSON.parse(JSON.stringify((request))).data.message.data;
  },
  getData(categoriesData, projectsData) {
    const categories = this.getCategories(categoriesData);
    const projects = this.getProjects(projectsData);

    return Promise.all([categories, projects]);
  },
  sendData(data) {
    axios.get('/directline-test-task/dist/?' + data.join('&'));
  }
}