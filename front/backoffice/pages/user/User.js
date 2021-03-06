const Utils = require('../../../common/utils/utils');
const APIRoutes = require('../../../common/api/routes');
const Messages = require('../../../common/api/messages');
const ReaderMixin = require('../../../common/mixins/ReaderMixin');
const LangMixin = require('../../../common/mixins/LangMixin');
const PaginationSearchMixin = require('../../../common/mixins/PaginationSearchMixin');

module.exports = {
    mixins: [ReaderMixin, LangMixin, PaginationSearchMixin],
    data() {
        return {
            state: {
                paths: {
                    reads: {
                        user: APIRoutes.entity('user', 'POST', true),
                        author: APIRoutes.entity('author', 'POST', true),
                        role: APIRoutes.entity('role', 'POST', true),
                    },
                    creations: {
                        user: APIRoutes.entity('user', 'POST'),
                    },
                },
                sinks: {
                    reads: {
                        role: 'role_read',
                        user: 'user_read',
                        author: 'author_read',
                    },
                    creations: {
                        search: 'search_creation_user',
                        user: 'user_creation',
                    },
                },
            },
        };
    },
    methods: {
    },
    mounted() {
        this.$store.state.requests = ['role', 'author'].map(e => ({
            name: 'search',
            type: 'dispatch',
            content: {
                form: this.state.sinks.reads[e],
                path: this.state.paths.reads[e],
                body: {
                    size: 10000,
                },
            },
        }));
    },
    computed: {
        authors() {
            const content = this.mcontent(this.state.sinks.reads.author);
            if (content instanceof Array) {
                return content;
            }
            return [];
        },
        roles() {
            const content = this.mcontent(this.state.sinks.reads.role);
            return content.map((c) => {
                c.name = this.lang(c.name);
                return c;
            });
        },
        search_query() {
            return JSON.stringify({
                $or: [
                    { firstname: '{{search}}' },
                    { lastname: '{{search}}' },
                    { fullname: '{{search}}' },
                    { 'emails.email': '{{search}}' },
                ],
            });
        },
    },
};
