import type { CustomNuxtApp, DeadlineItem } from "~/utils/types";
import DeadlinesController from "~/utils/deadlines-controller";

export default function useDeadlines() {
  const { $offlineDB, hook } = useNuxtApp() as CustomNuxtApp;
  const controller = new DeadlinesController($offlineDB);
  const toast = useCustomToast();
  const { options } = useOptions();

  const deadlines = useState<DeadlineItem[]>("deadlines", () => []);

  hook("app:mounted", async () => {
    try {
      deadlines.value =
        (await controller.initializeDeadlinesStore()) as DeadlineItem[];

      const initializeType = options.value.isFirstTime
        ? "Initialized"
        : "Restored";
      toast.success(`Local Database ${initializeType} for Deadlines.`);
    } catch (err) {
      // console.error("Error Initializing Deadlines Data", err);
      toast.error("Error Initializing Local Database for Deadlines.");
    }
  });

  const addDeadlineItem = async (deadline: DeadlineItem) => {
    deadlines.value.push(deadline);

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
      toast.success("Deadline Added Successfully.");
    } catch (e) {
      // console.error("Error Adding Item", e);
      toast.error("Error Adding Item.");
    }
  };

  const updateDeadlineItem = async (updatedDeadline: DeadlineItem) => {
    const index = deadlines.value.findIndex(
      (deadline) => deadline.id === updatedDeadline.id
    );

    if (index !== -1) {
      deadlines.value[index] = updatedDeadline;

      try {
        await controller.setDeadlines(
          JSON.parse(JSON.stringify(deadlines.value))
        );
        toast.success("Deadline Updated Successfully.");
      } catch (e) {
        // console.error("Error Updating Item", e);
        toast.error("Error Updating Item.");
      }
    }
  };

  const deleteDeadlineItem = async (deadlineId: string) => {
    deadlines.value = deadlines.value.filter((d) => d.id !== deadlineId);

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
      toast.success("Deadline Deleted Successfully.");
    } catch (e) {
      // console.error("Error Deleting Item", e);
      toast.error("Error Deleting Item.");
    }
  };

  const populateDeadlineItems = async (deadlineItems: DeadlineItem[]) => {
    deadlineItems.forEach((deadline) => {
      deadlines.value.push(deadline);
    });

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
    } catch (e) {
      // console.error("Error Adding Items", e);
      toast.error("Error Adding Items.");
    }
  };

  const purgeDeadlines = async () => {
    deadlines.value.splice(0, deadlines.value.length);

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
      toast.success("Database Purged Successfully.");
    } catch (e) {
      // console.error("Error Purging Deadlines", e);
      toast.error("Error Purging Database.");
    }
  };

  const sortedDeadlines = computed(() => {
    return [...deadlines.value].sort(
      (a: DeadlineItem, b: DeadlineItem) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  return {
    deadlines: sortedDeadlines,
    addDeadlineItem,
    updateDeadlineItem,
    deleteDeadlineItem,
    populateDeadlineItems,
    purgeDeadlines
  };
}
