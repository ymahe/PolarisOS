<template>
<form @submit.prevent="submit">
    <div class="columns is-centered" v-if="current_state === 'error_generic' && showErrors">
        <div class="column">
            <article class="message is-red">
                <div class="message-body">
                    <p><strong>{{lang('b_error_occured')}}</strong> {{error.content.message}}</p>
                </div>
            </article>
        </div>
    </div>
    <div class="columns is-centered" v-else-if="current_state === 'success_create' && showErrors">
        <div class="column">
            <article class="message is-green">
                <div class="message-body">
                    <p>{{success}}</p>
                </div>
            </article>
        </div>
    </div>
    <slot></slot>
    <div v-if="hasButtons" class="field is-grouped">
        <div class="control">
            <button class="button button-background-blue" v-if="current_state === 'loading'">
                <i class="fa fa-spinner fa-spin m-right-xs"></i>
                {{lang('b_loading')}}
            </button>
            <button v-else
                type="submit" @click="submit"
                class="button button-background-blue"
                >{{mode_text}}</button>
        </div>
        <div class="control">
            <button type="submit" @click="cancel" class="button button-background-red">{{lang('b_cancel')}}</button>
        </div>
    </div>
    <slot v-else
        name="buttons" 
        :cancel="cancel"
        :submit="submit"
        :update_mode="state.update_mode"
    >
    </slot>
    <div class="columns is-centered" v-if="current_state === 'error_generic' && showErrors">
        <div class="column">
            <article class="message is-red">
                <div class="message-body">
                    <p><strong>{{lang('b_error_occured')}}</strong> {{error.content.message}}</p>
                </div>
            </article>
        </div>
    </div>
    <div class="columns is-centered" v-else-if="current_state === 'success_create' && showErrors">
        <div class="column">
            <article class="message is-green">
                <div class="message-body">
                    <p>{{success}}</p>
                </div>
            </article>
        </div>
    </div>
</form>
</template>

<script>
    module.exports = require('./Form');
</script>
