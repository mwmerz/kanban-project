import { CssBaseline, Stack, Box } from "@mui/material";
import { DragDropContext, DropResult, DragUpdate } from "react-beautiful-dnd";
import { useTasks } from "hooks";
import { ColumnComponent, CreateListInput } from "./components";

function App() {
  const { taskData, saveTaskData } = useTasks();

  function onDragStart() {
    // TODO: effects that happen when the drag starts.
  }

  function onDragUpdate(update: DragUpdate) {
    // TODO: effects that happen as drag is updated.
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

    saveTaskData(newState);
  }
  return (
    <div>
      <CssBaseline />
      <CreateListInput />
      <Box bgcolor={"rgba(245,245,245,.55)"} minHeight={"100vh"}>
        <DragDropContext
          onDragUpdate={onDragUpdate}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <Stack direction={"row"} overflow={"scroll"}>
            {taskData.columnOrder.map((columnId) => {
              const column = taskData.columns[columnId];
              const tasks = column.taskIds.map((taskId) => {
                return taskData.tasks[taskId];
              });

              return (
                <ColumnComponent
                  key={column.id}
                  column={column}
                  tasks={tasks}
                />
              );
            })}
          </Stack>
        </DragDropContext>
      </Box>
    </div>
  );
}

export default App;
