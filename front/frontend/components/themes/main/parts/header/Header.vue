<template>
<div class="hero-head">
    <div class="container is-fluid">
        <div class="tile is-ancestor has-header-top-margin">
            <div class="tile is-parent is-2 is-vertical is-hidden-touch">
                <div class="image tile is-child">
                    <router-link to="/"><img src='/public/front/imgs/logo/logo.gif' alt='Logo' title='App Logo' style="width: 100px;" /></router-link>
                </div>
            </div>
            <div class="tile is-vertical is-parent">
                <div class="columns is-centered is-child">
                    <div class="column is-10 has-text-centered">
                        <widget-stats form="test_form" :infos="[]" />
                    </div>
                </div>
            </div>
            <div class="tile is-parent is-2 is-vertical">
                <p class="tile is-child has-text-centered" v-if="fullname != null">
                    <b-dropdown position="is-bottom-left">
                        <a class="navbar-item is-justify-center" slot="trigger">
                            <span>{{fullname}}</span>
                            <b-icon icon="caret-down"></b-icon>
                        </a>

                        <b-dropdown-item has-link>
                            <router-link class="dropdown-item" :to="`/u/${user_id}/profile`">{{lang('f_my_profile')}}</router-link>
                        </b-dropdown-item>
                        <b-dropdown-item has-link>
                            <a class="dropdown-item" @click="logout">
                                {{lang('f_logout')}}
                            </a>
                        </b-dropdown-item>
                    </b-dropdown>
                </p>
                <p v-else class="tile is-child has-text-centered">
                    <router-link class="navbar-item is-justify-center" slot="trigger" to="/login?redirect=%2F">
                        <span>Log in</span>
                    </router-link>
                </p>
                <p class="tile is-child has-text-centered">
                    <a class="has-text-red swap" @click.prevent="change_language('FR', $event)">FR</a> | <a class="has-text-red swap" @click.prevent="change_language('EN', $event)">EN</a>
                </p>
                <p class="tile is-child has-text-centered">
                    <a class="has-text-red swap" href='http://www.sorbonne-paris-cite.fr/en' title='www.ined.fr'>{{lang('l_go_to_website')}}</a>
                </p>
            </div>
        </div>
    </div>
    <navbar />
</div>
</template>

<script>
    module.exports = require('./Header');
</script>
