const moment = require('moment');
const _ = require('lodash');
const VSelect = require('vue-select').VueSelect;
const InputMixin = require('../../mixins/InputMixin');
const Utils = require('../../../../../utils/utils');
const Messages = require('../../../../../api/messages');
const RegisterMixin = require('../../../../../mixins/RegisterMixin');
const LangMixin = require('../../../../../mixins/LangMixin');
const ASCIIFolder = require('fold-to-ascii');

module.exports = {
    props: {
        name: { required: true, type: String },
        label: { default: '', type: String },
        placeholder: { default: '', type: String },
        isRequired: { default: false, type: Boolean },
        // form: { required: true, type: String }, //InputMixin
        multi: { default: false, type: Boolean },
        readonly: { default: false, type: Boolean },
        options: { required: true, type: Array },
        fieldLabel: { required: false, default: 'label', type: String },
        fieldValue: { required: false, default: 'value', type: String },
        hasAddons: { default: false, type: Boolean },
        modal_help: { default: false, type: Boolean },
        help: { required: false, default: '', type: String },
        viewValidationTexts: { required: false, default: true, type: Boolean },
        isAddon: { required: false, default: false, type: Boolean },
        resetOnOptionsChange: { default: false, type: Boolean },
        defaultValue: { default: null, required: false },
        translatable: { default: false, type: Boolean },
        ajax: { default: false, type: Boolean },
        ajaxUrl: { default: '', type: String },
        ajaxValueUrl: { default: '', type: String },
    },
    components: {
        'v-select': VSelect,
    },
    mixins: [RegisterMixin, InputMixin, LangMixin],
    data() {
        return {
            state: {
                selected: null,
                options: [],
                showHelpModal: false,
                form: `${name}_${+moment()}`,
            },
        };
    },
    methods: {
        onSearch(search, loading) {
            loading(true);
            this.search(loading, search, this);
        },
        filterFunction(option, label, search) {
            const l = ASCIIFolder.fold(label || '', '').toLowerCase();
            const s = ASCIIFolder.fold(search, '').toLowerCase();
            return l.indexOf(s) > -1;
        },
        merge_options_and_selected(selected, options) {
            if (options.length < selected.length) {
                return this.merge_options_and_selected(options, selected);
            }

            const new_elements = selected.reduce((arr, data) => {
                const elt = _.find(options, o => o[this.fieldValue] === data[this.fieldValue]);
                if (!elt) {
                    arr.push(data);
                }
                return arr;
            }, []);

            return new_elements.concat(options);
        },
        set_selected(missings) {
            const values = missings.map((m) => {
                if (typeof m === 'string') {
                    return m;
                }
                return m[this.fieldValue];
            });

            if (this.ajax) {
                const promise = this.$store.dispatch('search', {
                    form: this.state.form,
                    path: this.ajaxValueUrl,
                    body: {
                        where: {
                            [this.fieldValue]: values,
                        },
                        projection: [this.fieldLabel, this.fieldValue],
                        size: values.length,
                    },
                });

                promise.then((res) => {
                    const opts = this.translate_options(res.data);
                    if (this.multi) {
                        this.state.options = this.format_options(this.merge_options_and_selected(opts, this.options), 'to');
                        this.state.selected = this.format_options(opts, 'to');
                    } else if (res.data.length > 0) {
                        this.state.options = this.format_options(this.merge_options_and_selected(opts, this.options), 'to');
                        this.state.selected = this.format_options(opts, 'to')[0];
                    } else {
                        this.state.selected = null;
                    }
                });
                return;
            }

            const data = values.reduce((arr, v) => {
                const elt = _.find(this.options, o => o[this.fieldValue] === v);
                if (elt) {
                    arr.push(elt);
                }
                return arr;
            }, []);


            if (this.multi) {
                this.state.selected = this.format_options(data, 'to');
            } else if (data.length > 0) {
                this.state.selected = this.format_options(data, 'to')[0];
            } else {
                this.state.selected = null;
            }
        },
        search: _.debounce((loading, search, self) => {
            const promise = self.$store.dispatch('search', {
                form: self.state.form,
                path: self.ajaxUrl,
                body: {
                    where: {
                        [self.fieldLabel]: search,
                    },
                    projection: [self.fieldLabel, self.fieldValue],
                    size: 20,
                },
            });
            promise.then((res) => {
                loading(false);
                if (self.state.selected) {
                    let selected = self.state.selected instanceof Array ?
                        self.state.selected : [self.state.selected];
                    selected = self.format_options(selected, 'from');
                    self.state.options = self.format_options(self.merge_options_and_selected(selected, self.translate_options(res.data)), 'to');
                } else {
                    self.state.options = self.format_options(self.translate_options(res.data), 'to');
                }
            });
        }, 350),
        toggleHelpModal(e) {
            e.preventDefault();
            if (this.modal_help) {
                this.state.showHelpModal = !this.state.showHelpModal;
            }
        },
        initialize() {
            const form = this.$store.state.forms[this.form];
            const info = Utils.find_value_with_path(form.content, this.name.split('.'));

            if (info == null) {
                this.state.selected = this.defaultValue;
                return;
            }

            if (info instanceof Array) {
                this.set_selected(info);
                return;
            }

            if (typeof info === 'string') {
                this.set_selected([{ [this.fieldValue]: info }]);
                return;
            }

            info[this.fieldLabel] = '';
            this.set_selected([info]);
        },
        start_collection() {
            this.$store.commit(Messages.COMPLETE_FORM_ELEMENT, {
                form: this.form,
                name: this.name,
                info: this.extract_values(this.state.selected),
            });
        },
        onChange(val) {
            if (this.readonly) {
                // Noop
            } else {
                this.state.selected = val;
                this.$emit('select-change', val);
            }
        },
        extract_values(infos) {
            if (infos == null) {
                return null;
            }

            if (infos instanceof Array) {
                return infos.map(o => ({ [this.fieldValue]: o.value }));
            }
            return infos.value;
        },
        translate_options(options) {
            if (this.translatable) {
                return options.map((data) => {
                    data[this.fieldLabel] = this.lang(data[this.fieldLabel]);
                    return data;
                });
            }
            return options;
        },
        format_options(options, direction = 'to') {
            // Direction:
            // to -> to vue-select
            // from -> from vue-select
            if (direction === 'to') {
                return options.map(opt => ({
                    label: opt[this.fieldLabel],
                    value: opt[this.fieldValue],
                }));
            }

            return options.map(opt => ({
                [this.fieldLabel]: opt.label,
                [this.fieldValue]: opt.value,
            }));
        },
    },
    watch: {
        options() {
            this.state.options = this.format_options(this.options, 'to');
        },
        current_state(s) {
            this.dispatch(s, this);
        },
    },
    beforeMount() {
        this.state.options = this.format_options(this.options, 'to');
    },
    mounted() {
        this.initialize();
    },
    computed: {
        isHidden() {
            return this.readonly && (this.state.selected == null ||
            (this.state.selected instanceof Array && this.state.selected.length === 0));
        },
        readonlyValue() {
            if (this.state.selected instanceof Array) {
                return this.state.selected.map(s => s.label);
            }
            return this.state.selected ? this.state.selected.label : '';
        },
        current_state() {
            return this.fstate(this.form);
        },
    },
};
