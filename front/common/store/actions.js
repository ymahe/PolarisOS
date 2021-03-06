const _ = require('lodash');
const API = require('../api');
const Messages = require('../api/messages');
const Auth = require('../utils/auth');
const Utils = require('../utils/utils');

function run_fetch_mutation(action, response, form, ctx) {
    const succeeded = response.type === Messages.SUCCESS;
    const results = Utils.crunch_data_for_fetch(action, succeeded, response.content || []);
    ctx.commit(Messages.FETCH, _.merge({}, results, {
        action,
        succeeded,
        form,
        content: response.content,
        commit: ctx.commit }));

    return results;
}

async function create_or_update_or_validate(ctx, { path, body, form, rform, rpath }, action = 'create') {
    const method = action === 'update' ? 'PUT' : 'POST';

    const payload = {
        path,
        method,
        body,
        signature: Auth.get_api_headers(method, path),
    };

    ctx.commit(Messages.LOADING, { form });
    const response = await API.fetch(payload);
    const results = run_fetch_mutation(action, response, form, ctx);

    /* if (action !== 'validate'
        && rform !== '' && rpath !== ''
        && rform != null && rpath != null) {
        ctx.dispatch('single_read', {
            form: rform,
            path: rpath,
        });
        }*/

    return results;
}

module.exports = {
    fetch: async (ctx, { path, method, body, action, form }) => {
        const payload = {
            path,
            method,
            body,
            commit: ctx.commit,
            signature: Auth.get_api_headers(method, path),
        };

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        const results = run_fetch_mutation(action, response, form, ctx);
        return results;
    },

    create: async (ctx, payload) => await create_or_update_or_validate(ctx, payload, 'create'),

    update: async (ctx, payload) => await create_or_update_or_validate(ctx, payload, 'update'),

    validate: async (ctx, payload) => await create_or_update_or_validate(ctx, payload, 'validate'),

    remove: async (ctx, { path, form }) => {
        const payload = {
            path,
            method: 'DEL',
            signature: Auth.get_api_headers('DEL', path),
        };
        const action = 'delete';

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        const results = run_fetch_mutation(action, response, form, ctx);
        return results;
    },

    single_read: async (ctx, { form, path }) => {
        const payload = {
            path,
            method: 'GET',
            signature: Auth.get_api_headers('GET', path),
        };
        const action = 'read';

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        const results = run_fetch_mutation(action, response, form, ctx);
        return results;
    },

    search: async (ctx, { form, path, body }) => {
        const payload = {
            path,
            method: 'POST',
            body,
            signature: Auth.get_api_headers('POST', path),
        };
        const action = 'read';

        ctx.commit(Messages.LOADING, { form });
        const response = await API.fetch(payload);
        const results = run_fetch_mutation(action, response, form, ctx);
        return results;
    },

    grab_config: async (ctx, { path, body }) => {
        const payload = {
            path,
            method: 'POST',
            body,
            signature: Auth.get_api_headers('POST', path),
        };

        const response = await API.fetch(payload);
        // const success = response.type === Messages.SUCCESS;
        if (response.content == null) {
            response.content = {};
        }

        const content = 'result' in response.content
            && 'hits' in response.content.result ? response.content.result.hits : [];
        if (content.length > 0) {
            ctx.state.global_config = content[0].source;
        }
    },

    grab_language: async (ctx, { path, body }) => {
        const payload = {
            path,
            method: 'POST',
            body,
            signature: Auth.get_api_headers('POST', path),
        };

        const response = await API.fetch(payload);
        // const success = response.type === Messages.SUCCESS;
        if (response.content == null) {
            response.content = {};
        }

        const content = 'result' in response.content
            && 'hits' in response.content.result ? response.content.result.hits : [];
        ctx.state.lang_content = content.reduce((obj, src) => {
            const l = src.source;
            const lang = obj[l.lang] || {};
            lang[l.key] = l.values.reduce((values, v) => {
                values[v.quantity] = v.value;
                return values;
            }, {});
            obj[l.lang] = lang;
            return obj;
        }, {});
    },

    authenticate: async (ctx, { email, password }) => {
        const ok = await Auth.authenticate(email, password);
        const status = ok ? 'success' : 'fail';
        ctx.commit(Messages.LOGIN_PASS, { status });
    },
};
