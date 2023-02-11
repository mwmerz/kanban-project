import { CssBaseline } from "@mui/material";
import { DragDropContext, DropResult, DragUpdate } from "react-beautiful-dnd";
import { useTasks } from "hooks";
import { ColumnComponent } from "./components";

function App() {
  const { taskData, setTaskData } = useTasks();

  function onDragStart() {
    // TODO: effects that happen when the drag starts.
    document.body.style.transition = "background-color 0.2s ease";
  }

  function onDragUpdate(update: DragUpdate) {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(taskData.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 153, 153, ${opacity})`;
  }

  function onDragEnd(result: DropResult) {
    document.body.style.backgroundColor = `inherit`;
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = taskData.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...taskData,
      columns: {
        ...taskData.columns,
        [newColumn.id]: newColumn,
      },
    };

    setTaskData(newState);
  }
  return (
    <div>
      <CssBaseline />
      <DragDropContext
        onDragUpdate={onDragUpdate}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {taskData.columnOrder.map((columnId) => {
          const column = taskData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => {
            return taskData.tasks[taskId];
          });

          return (
            <ColumnComponent key={column.id} column={column} tasks={tasks} />
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
