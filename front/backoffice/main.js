const Vue = require('vue');
const Buefy = require('buefy');
const VueWysiwyg = require('vue-wysiwyg');
const router = require('./router');
const store = require('../common/store');

const Loader = require('./components/loader/Loader.vue');
const Input = require('../common/components/main/forms/elements/input/Input.vue');
const Select = require('../common/components/main/forms/elements/select/Select.vue');
const VariadicElement = require('../common/components/main/forms/elements/variadic_element/VariadicElement.vue');
const Form = require('../common/components/main/forms/form/Form.vue');
const DynamicForm = require('../common/components/main/forms/dynamic_form/DynamicForm.vue');
const Paginator = require('../common/components/main/paginator/Paginator.vue');
const Tabber = require('../common/components/main/tabber/Tabber.vue');
const Grid = require('../common/components/main/forms/elements/grid/Grid.vue');
const Card = require('../common/components/main/card/Card.vue');
const Searching = require('../common/components/main/forms/searching/Searching.vue');

const ActionButton = require('./components/themes/main/components/action_button/ActionButton.vue');
const Widget = require('../common/components/main/widget/Widget.vue');

const App = require('./pages/App.vue');

Vue.use(Buefy.default, {
    defaultIconPack: 'fa',
});

Vue.use(VueWysiwyg.default, {
    hideModules: { image: true },
});

Vue.component('loader', Loader);
Vue.component('fform', Form);
Vue.component('finput', Input);
Vue.component('fselect', Select);
Vue.component('fgrid', Grid);
Vue.component('fvariadic-element', VariadicElement);
Vue.component('action-button', ActionButton);
Vue.component('widget', Widget);
Vue.component('paginator', Paginator);
Vue.component('tabber', Tabber);
Vue.component('card', Card);
Vue.component('fsearching', Searching);
Vue.component('dynamic-form', DynamicForm);

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
});
