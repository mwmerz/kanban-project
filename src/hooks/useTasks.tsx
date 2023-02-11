import { useState } from "react";
import { initialData, KanbanData } from "data";

export function useTasks() {
  const [taskData, setTaskData] = useState<KanbanData>(initialData);

  return {
    taskData,
    setTaskData,
  };
}
