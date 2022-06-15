const { createApp, defineComponent, defineAsyncComponent } = Vue;
import '../scss/settings.scss';
import { Widget } from './components/Widget/Widget.js';

const RootComponent = defineComponent({
  name: 'Root',
  components: {
    Widget,
  },
  template: '<Suspense><Widget/></Suspense>'
})

const App = createApp(RootComponent);
App.mount('#widget');
