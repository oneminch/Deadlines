import { toast } from "vue-sonner";

export default function useCustomToast() {
  const options = useState<Options>("options");

  const customToast = {
    success: (detail: string, bypass: boolean = false) => {
      if (!options.value.toastsEnabled && !bypass) {
        console.log(detail);
        return;
      }

      toast.success(detail);
    },
    error: (detail: string, bypass: boolean = false) => {
      if (!options.value.toastsEnabled && !bypass) {
        console.log(detail);
        return;
      }

      toast.error(detail);
    }
  };

  return customToast;
}
