import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { useSnackbar } from "notistack";
import { Task } from "data";
import { LOCAL_STORAGE_KEY } from "config";
import { initialData, KanbanData } from "data";
import { useLocalStorage } from "hooks";

export type ITaskContext = {
  taskData: KanbanData;
  saveTaskData: (data: KanbanData) => void;
  addTask: (columnId: string) => void;
  addColumn: (name: string) => void;
  clearLocalStorage: () => void;
  clearState: () => void;
};

export const TaskContext = createContext<ITaskContext>({} as ITaskContext);

/**
 *  TaskProvider
 *  Holds task state and provides update functions through hook.
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<KanbanData>(initialData);

  // localstorage hook
  const [savedData, setSavedData] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    initialData
  );

  // clear local storage
  function clearLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  // wipe state
  function clearState() {
    clearLocalStorage();
    setTaskData(initialData);
    enqueueSnackbar("State cleared.", { variant: "warning" });
  }

  // update state - saves both local and active state.
  function saveTaskData(data: KanbanData) {
    setSavedData(data);
    setTaskData(data);
  }

  // check to see if the local state needs to be loaded.
  // update app state to use local state.
  useEffect(() => {
    if (!localLoaded) {
      if (savedData) {
        setTaskData(savedData);
        setLocalLoaded(true);
        enqueueSnackbar("Kanban Loaded from save.", { variant: "success" });
      }
    }
  }, [localLoaded, savedData, enqueueSnackbar]);

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
    const newTask: Task = {
      name: "New Task",
      id: newTaskId,
      description: "",
      dateCreated: new Date().valueOf(),
      status: "Open",
    };

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
    saveTaskData(newState);
    enqueueSnackbar(`New task: ${newTask.name} added!`, { variant: "success" });
  }

  /**
   * Add a new column
   * @param title name of new column
   */
  function addColumn(title: string) {
    // create the new column object
    const newColumn = {
      id: `column-${new Date().valueOf()}`,
      title,
      taskIds: [],
    };

    // clone existing columns, add new one at the end.
    const newColumns = {
      ...structuredClone(taskData.columns),
      [newColumn.id]: newColumn,
    };

    // clone column ids/orders
    const newColumnIds = [...Array.from(taskData.columnOrder), newColumn.id];

    // create new state object
    const newState: KanbanData = {
      tasks: { ...taskData.tasks },
      columns: newColumns,
      columnOrder: [...newColumnIds],
    };

    // save it
    saveTaskData(newState);
    enqueueSnackbar(`New column: ${newColumn.title} added!`, {
      variant: "success",
    });
  }

  return (
    <TaskContext.Provider
      value={{
        taskData,
        saveTaskData,
        addTask,
        clearLocalStorage,
        clearState,
        addColumn,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
