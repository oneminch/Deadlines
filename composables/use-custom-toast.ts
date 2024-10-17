import type { ToastMessageOptions } from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default function useCustomToast() {
  const options = useState<Options>("options");
  const toast = useToast();

  const customToast = {
    success: (detail: string, bypass: boolean = false) => {
      if (!options.value.toastsEnabled && !bypass) {
        console.log(detail);
        return;
      }
      const toastOptions: ToastMessageOptions = {
        severity: "success",
        summary: "Success",
        detail,
        life: 3000
      };

      toast.add(toastOptions);
    },
    error: (detail: string, bypass: boolean = false) => {
      if (!options.value.toastsEnabled && !bypass) {
        console.log(detail);
        return;
      }
      const toastOptions: ToastMessageOptions = {
        severity: "error",
        summary: "Error",
        detail,
        life: 3000
      };

      toast.add(toastOptions);
    }
  };

  return customToast;
}
