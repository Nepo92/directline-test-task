const {defineComponent, ref, onMounted} = Vue;
import './Loader.scss';

const Loader = defineComponent({
  name: 'loader',
  emits: ['create-loader'],
  setup(props, {emit}) {
    const loader = ref(null);

    const showLoader = (loader) => {
      loader.classList.add('show');
    };

    const hideLoader = (loader) => {
      loader.classList.remove('show');
    };

    onMounted(() => {
      emit('create-loader', {
        showLoader: showLoader.bind(this),
        hideLoader: hideLoader.bind(this),
        loader: loader.value,
      })
    })

    return {
      loader,
    }
  },
  template: `<div ref="loader" class="loader"></div>`
});

export default Loader;
