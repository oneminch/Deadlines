import type { CustomNuxtApp, DeadlineItem } from "~/utils/types";
import DeadlinesController from "~/utils/deadlines-controller";

export default function useDeadlines() {
  const { $offlineDB } = useNuxtApp() as CustomNuxtApp;
  const controller = new DeadlinesController($offlineDB);

  const deadlines = useState<DeadlineItem[]>("deadlines", () => []);

  onMounted(async () => {
    try {
      await controller.initializeDeadlinesStore();
      deadlines.value = await controller.getDeadlines();
    } catch (err) {
      console.error("Error Initializing Deadlines Data", err);
    }
  });

  const addDeadlineItem = async (deadline: DeadlineItem) => {
    deadlines.value.push(deadline);

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
    } catch (e) {
      console.error("Error Adding Item", e);
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
      } catch (e) {
        console.error("Error Updating Item", e);
      }
    }
  };

  const deleteDeadlineItem = async (deadlineId: string) => {
    deadlines.value = deadlines.value.filter((d) => d.id !== deadlineId);

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
    } catch (e) {
      console.error("Error Deleting Item", e);
    }
  };

  const purgeDeadlines = async () => {
    deadlines.value.splice(0, deadlines.value.length);

    try {
      await controller.setDeadlines(
        JSON.parse(JSON.stringify(deadlines.value))
      );
    } catch (e) {
      console.error("Error Purging Deadlines", e);
    }
  };

  const hardPurgeDeadlines = async () => {
    deadlines.value.splice(0, deadlines.value.length);

    try {
      await controller.hardPurgeDeadlines();
    } catch (e) {
      console.error("Error Purging Deadlines", e);
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
    purgeDeadlines,
    hardPurgeDeadlines
  };
}
