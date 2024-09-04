import type { CustomNuxtApp, Options } from "~/utils/types";
import OptionsController from "~/utils/options-controller";

export default function useOptions() {
  const { $offlineDB } = useNuxtApp() as CustomNuxtApp;
  const controller = new OptionsController($offlineDB);

  const options = useState<Options | {}>("options", () => ({}));

  onMounted(async () => {
    try {
      await controller.initializeOptionsStore();
      options.value = await controller.getOptions();
    } catch (err) {
      console.error("Error Initializing Options Data", err);
    }
  });

  const updateOptions = async (newOptions: Options) => {
    options.value = {
      ...JSON.parse(JSON.stringify(options.value)),
      ...newOptions
    };

    try {
      await controller.setOptions(JSON.parse(JSON.stringify(options.value)));
    } catch (e) {
      console.error("Error Updating Item", e);
    }
  };

  return {
    options,
    updateOptions
  };
}
