import { CssBaseline, Stack, Box } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  DropResult,
  DragUpdate,
} from "react-beautiful-dnd";
import { useTasks } from "hooks";
import { cobaltBlue } from "styles";
import { ColumnComponent, CreateListInput } from "./components";

function App() {
  const { taskData, moveTask, moveColumn } = useTasks();

  function onDragStart() {
    // TODO: effects that happen when the drag starts.
  }

  function onDragUpdate(update: DragUpdate) {
    // TODO: effects that happen as drag is updated.
  }

  function onDragEnd(result: DropResult) {
    if (result.type === "tasks") {
      moveTask(result);
    } else {
      moveColumn(result);
    }
  }
  return (
    <div>
      <CssBaseline />
      <CreateListInput />
      <Box
        sx={{
          backgroundImage: "url(/BannerOpacity.png)",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        bgcolor={cobaltBlue}
        minHeight={"100vh"}
      >
        <DragDropContext
          onDragUpdate={onDragUpdate}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <Droppable
            droppableId={"all-columns"}
            direction={"horizontal"}
            type={"column"}
          >
            {(provided) => (
              <Stack
                {...provided.droppableProps}
                ref={provided.innerRef}
                direction={"row"}
                overflow={"scroll"}
              >
                {taskData.columnOrder.map((columnId, index) => {
                  const column = taskData.columns[columnId];
                  const tasks = column.taskIds.map((taskId) => {
                    return taskData.tasks[taskId];
                  });

                  return (
                    <ColumnComponent
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      index={index}
                    />
                  );
                })}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </div>
  );
}

export default App;
