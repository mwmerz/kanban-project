import { useContext, createContext, ReactNode } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useSnackbar } from "notistack";
import { Task } from "data";
import { LOCAL_STORAGE_KEY } from "config";
import { initialData, KanbanData } from "data";
import { useLocalStorage } from "hooks";

export type ITaskContext = {
  taskData: KanbanData;
  saveTaskData: (data: KanbanData) => void;
  addTask: (columnId: string) => void;
  editTask: (taskId: string, taskInfo: Task) => void;
  deleteTask: (taskId: string, columnId: string, index: number) => void;
  moveTask: (result: DropResult) => void;
  addColumn: (name: string) => void;
  renameColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string, index: number) => void;
  moveColumn: (result: DropResult) => void;
  clearState: () => void;
};

export const TaskContext = createContext<ITaskContext>({} as ITaskContext);

/**
 *  Holds task state and provides update functions through hook.
 *  TODO: decouple task/group objects from drag/drop system.
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();

  // create store and handle for localstorage item.
  // similar API to useState.
  const [taskData, setSavedData] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    initialData
  );

  // wipe state by clearing the local storage and setting the taskData state item to the initial state.
  // then, push a message to the user.
  function clearState() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSavedData(initialData);
    enqueueSnackbar("State cleared.", { variant: "warning" });
  }

  // update state - saves both local and active state.
  function saveTaskData(data: KanbanData) {
    setSavedData(data);
  }

  /**
   * create new tasks
   *
   * @param columnId string of the column ID the task will belong to
   * @return void
   */
  function addTask(columnId: string) {
    // fetch column
    const column = taskData.columns[columnId];

    // generate a new task id based on count of existing tasks.
    const newTaskId = `task-${new Date().valueOf()}`;

    // create a new Task object
    // TODO: use oop classes.
    const newTask: Task = {
      name: "New Task",
      id: newTaskId,
      description: "",
      dateCreated: new Date().valueOf(),
      status: "Open",
      archived: false,
    };

    // clone the existing tasklist with the new task in it
    const newTasks = {
      ...taskData.tasks,
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
   * move task from one column to another.
   *
   * @param result drop result fed from onDragEnd function.
   * @returns void
   */
  function moveTask(result: DropResult) {
    const { source, destination, draggableId } = result;

    // Guard - return void if:
    // null destination
    if (!destination) return;

    // destination is same as source
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // store the start column and end column
    const start = taskData.columns[source.droppableId];
    const finish = taskData.columns[destination.droppableId];

    // test if the task is going to a new column
    if (start === finish) {
      // create a new taskid attribute, cloning the previous state
      const newTaskIds = Array.from(start.taskIds);

      // splice the taskid from the previous column
      // splice the task id into the new column
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      // create a new column object, cloning the previous state and adding the new taskid
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      // create a new state object, cloning the previous state, and adding the new column.
      const newState = {
        ...taskData,
        columns: {
          ...taskData.columns,
          [newColumn.id]: newColumn,
        },
      };

      // overwrite the state data with the new state object.
      saveTaskData(newState);
      return;
    }

    // move from one list to another
    // create a new taskid property for the starting column, cloning from previous
    const startTaskIds = Array.from(start.taskIds);

    // splice the task out of the starting column
    startTaskIds.splice(source.index, 1);

    // create a new column object with the task id removed.
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    // create a new task id property for the destination column, cloning from previous
    const finishTaskIds = Array.from(finish.taskIds);

    // splice the task into the destination column
    finishTaskIds.splice(destination.index, 0, draggableId);

    // create a new column object with the task id inserted
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    // clone the state object, updating columns
    const newState = {
      ...taskData,
      columns: {
        ...taskData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    // overwrite the state with the new state.
    saveTaskData(newState);
    return;
  }

  /**
   * edit a task
   *
   * @param taskId id of task to edit
   * @param taskInfo new info for task
   * @returns void
   */
  function editTask(taskId: string, taskInfo: Task) {
    // make sure task exists
    if (!taskData.tasks[taskId]) return;

    // check to see if taskData is changing
    if (JSON.stringify(taskData.tasks[taskId]) === JSON.stringify(taskInfo))
      return;

    // create a new task object with new task info.
    let newTask = { [taskId]: { ...taskInfo } };

    // createa  new state object with new task.
    let newState = {
      ...taskData,
      tasks: {
        ...taskData.tasks,
        ...newTask,
      },
    };

    // overwrite state with new state
    setSavedData(newState);
  }

  /**
   * deletes a task and updates the column it was in.
   *
   * @param taskId id of task to be deleted
   * @param columnId id of column containing task
   * @param index index of task within column
   * @returns void
   */
  function deleteTask(taskId: string, columnId: string, index: number) {
    // make sure task exists. if it doesn't, just return.
    if (!taskData.tasks[taskId]) return;

    // create new tasks object without tasks.
    const newTasks = { ...taskData.tasks };
    delete newTasks[taskId];

    // clone column, removing task from list
    const newColumn = taskData.columns[columnId];
    newColumn.taskIds.splice(index, 1);

    // create new state object with task removed from tasks and column.
    const newState = {
      ...taskData,
      tasks: { ...newTasks },
      columns: { ...taskData.columns, [newColumn.id]: newColumn },
    };

    // overwrite state with new state object
    setSavedData(newState);
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
      ...taskData.columns,
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

  /**
   * Move a column
   * @param result drop result fed from onDragEnd function.
   * @returns void
   */
  function moveColumn(result: DropResult) {
    const { source, destination, draggableId } = result;

    // Guard - return void if:
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // create a new column order object, cloning the previous order
    const newColumnOrder = Array.from(taskData.columnOrder);

    // splice the previous column from the source
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);

    // create a new state object with updated column order
    const newState = {
      ...taskData,
      columnOrder: newColumnOrder,
    };

    // overwrite the state with new state.
    saveTaskData(newState);
    return;
  }

  /**
   * Rename column
   * @param columnId id of column to be renamed
   * @param title new title to rename to
   */
  function renameColumn(columnId: string, title: string) {
    // grab and clone column
    const newColumn = { [columnId]: { ...taskData.columns[columnId], title } };

    // clone state with updated column.
    const newState: KanbanData = {
      ...taskData,
      columns: {
        ...taskData.columns,
        ...newColumn,
      },
    };

    // overwrite state with new state
    saveTaskData(newState);
  }

  /**
   * Delete a column
   * @param columnId id of column to be deleted
   * @param index index of column within order array
   */
  function deleteColumn(columnId: string, index: number) {
    // clone columns and remove this column by id
    const newColumns = { ...taskData.columns };
    delete newColumns[columnId];

    // clone column order and remove this column by index
    const newColumnOrder = Array.from(taskData.columnOrder);
    newColumnOrder.splice(index, 1);

    // clone state and update it with new state.
    const newState: KanbanData = {
      ...taskData,
      columns: { ...newColumns },
      columnOrder: [...newColumnOrder],
    };

    // overwrite state with new state
    saveTaskData(newState);
  }

  return (
    <TaskContext.Provider
      value={{
        taskData,
        saveTaskData,
        addTask,
        editTask,
        deleteTask,
        moveTask,
        addColumn,
        renameColumn,
        deleteColumn,
        moveColumn,
        clearState,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
