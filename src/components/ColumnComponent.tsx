import { ReactNode } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";
import { Column, Task } from "data";
import { useTasks } from "hooks";
import { lightBlue, transparentGrey } from "styles";
import { TaskComponent } from "./TaskComponent";
import { Handle } from "./Handle";

const Title = ({ children }: { children: ReactNode }) => (
  <Box
    fontWeight={"bold"}
    fontSize={"1.17em"}
    p={"8px"}
    color={"rgba(22,22,22,1)"}
    bgcolor={"rgba(255,255,255,.3)"}
  >
    {children}
  </Box>
);

export function ColumnComponent({
  column,
  tasks,
  index,
}: {
  column: Column;
  tasks: Task[];
  index: number;
}) {
  const { addTask } = useTasks();

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <Box ref={provided.innerRef} {...provided.draggableProps}>
          <Box
            m={"8px"}
            bgcolor={transparentGrey}
            width={"300px"}
            border={"1px solid lightgrey"}
            borderRadius={"2px"}
          >
            <Title>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"}>
                  <Handle {...provided.dragHandleProps} />
                  <Box>{column.title}</Box>
                </Stack>
                <Box p={"8px"}>
                  <Button
                    variant={"contained"}
                    size={"small"}
                    onClick={() => {
                      addTask(column.id);
                    }}
                  >
                    <Box display={"flex"}>
                      <AddIcon />
                    </Box>
                  </Button>
                </Box>
              </Stack>
            </Title>
            <Droppable droppableId={column.id} type={"tasks"}>
              {(provided: DroppableProvided, snapshot) => (
                <Box
                  sx={{ transition: "background-color 0.2s ease" }}
                  boxShadow={snapshot.isDraggingOver ? 2 : 0}
                  bgcolor={snapshot.isDraggingOver ? lightBlue : ""}
                  p={"8px"}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks.map((task, index) => {
                    return (
                      <TaskComponent key={task.id} task={task} index={index} />
                    );
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
            <Box
              p={"8px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            ></Box>
          </Box>
        </Box>
      )}
    </Draggable>
  );
}
