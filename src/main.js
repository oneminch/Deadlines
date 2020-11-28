import Vue from "vue";
import App from "./App.vue";
// import VueTippy from "vue-tippy";
import VueToggles from "vue-toggles";
import VSwatches from "vue-swatches";
import Toast from "vue-toastification";
import Datepicker from "vuejs-datepicker";
import "vue-toastification/dist/index.css";
import "vue-swatches/dist/vue-swatches.css";
import VueTippy, { TippyComponent } from "vue-tippy";
import vueConfirmationButton from "vue-confirmation-button";

Vue.component("v-swatches", VSwatches);
Vue.component("tippy", TippyComponent);
Vue.component("datepicker", Datepicker);
Vue.component("VueToggles", VueToggles);
Vue.component("vue-confirmation-button", vueConfirmationButton);

Vue.use(VueTippy, {
	placement: "bottom",
	animation: "scale",
	duration: 150,
});

Vue.use(Toast, {
	transition: "Vue-Toastification__bounce",
	maxToasts: 3,
	newestOnTop: true,
	position: "bottom-center",
	timeout: 2500,
	closeOnClick: true,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
	draggablePercent: 0.5,
	showCloseButtonOnHover: true,
	hideProgressBar: false,
	closeButton: "button",
	icon: true,
	toastClassName: "all-toasts",
});

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount("#app");
