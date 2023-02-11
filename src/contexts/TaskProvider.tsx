import {
  useState,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Task } from "data";
import { initialData, KanbanData } from "data";

export type ITaskContext = {
  taskData: KanbanData;
  setTaskData: Dispatch<SetStateAction<KanbanData>>;
  addTask: (columnId: string) => void;
};

export const TaskContext = createContext<ITaskContext>({} as ITaskContext);

/**
 *  TaskProvider
 *  Holds task state and provides update functions through hook.
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const [taskData, setTaskData] = useState<KanbanData>(initialData);

  /**
   * Function to create new tasks
   * @param columnId string of the column ID the task will belong to
   */
  function addTask(columnId: string) {
    // fetch column
    const column = taskData.columns[columnId];

    // generate a new task id based on count of existing tasks.
    // TODO: use timestamp as unique
    const newTaskId = `task-${Object.entries(taskData.tasks).length + 1}`;

    // create a new Task object
    // TODO: use objects
    const newTask: Task = { content: "New Task", id: newTaskId };

    // clone the existing tasklist with the new task in it
    const newTasks = {
      ...structuredClone(taskData.tasks),
      [newTaskId]: newTask,
    };

    // clone the taskid array of the current column
    const newTaskIds = [...Array.from(column.taskIds), newTaskId];

    // clone the existing column with the new task id.
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    // clone the state object.
    const newState = {
      ...taskData,
      columns: {
        ...taskData.columns,
        [newColumn.id]: newColumn,
      },
      tasks: {
        ...newTasks,
      },
    };

    // update the state object
    setTaskData(newState);
  }
  return (
    <TaskContext.Provider
      value={{
        taskData,
        setTaskData,
        addTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
