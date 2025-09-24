import type { CustomNuxtApp, Options } from "~/utils/types";
import OptionsController from "~/utils/options-controller";

export default function useOptions() {
  const toast = useCustomToast();
  const { $offlineDB, hook } = useNuxtApp() as CustomNuxtApp;
  const controller = new OptionsController($offlineDB);

  const options = useState<Options>("options", () => ({}));
  const initialized = useState("options-db:initialized", () => false);

  hook("app:mounted", async () => {
    if (initialized.value) return;

    try {
      options.value = (await controller.initializeOptionsStore()) as Options;

      if (options.value.isFirstTime) {
        await updateOptions({ isFirstTime: false }, false);
      }
      console.log("Local Database Initialized for Options.");
      initialized.value = true;
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
