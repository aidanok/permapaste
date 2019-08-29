import VueRouter, { Route } from 'vue-router'

// Add extra typings to Vue instances.

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter,
    $route: Route
  }
}