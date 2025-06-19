import type { CustomNuxtApp, Options } from "~/utils/types";
import OptionsController from "~/utils/options-controller";
import AppAboutModal from "~/components/modals/AppAboutModal.vue";

export default function useOptions() {
  const { openModal } = useModal();
  const toast = useCustomToast();
  const { $offlineDB, hook } = useNuxtApp() as CustomNuxtApp;
  const controller = new OptionsController($offlineDB);

  const options = useState<Options>("options", () => ({}));

  hook("app:mounted", async () => {
    try {
      options.value = (await controller.initializeOptionsStore()) as Options;

      // Show info modal for first time only
      if (options.value.isFirstTime) {
        openModal(AppAboutModal, {}, async () => {
          await updateOptions({ isFirstTime: false }, false);
        });
      }
      console.log("Local Database Initialized for Options.");
    } catch (err) {
      console.error("Error Initializing Local Database for Options:", err);
    }
  });

  const updateOptions = async (newOptions: Options, notify: boolean = true) => {
    options.value = {
      ...JSON.parse(JSON.stringify(options.value)),
      ...newOptions
    };

    try {
      await controller.setOptions(JSON.parse(JSON.stringify(options.value)));

      if (notify) {
        toast.success("Options Updated Successfully.");
      }
    } catch (e) {
      console.error("Error Updating Options Database:", e);

      if (notify) {
        toast.error("Error Updating Options.");
      }
    }
  };

  return {
    options,
    updateOptions
  };
}
