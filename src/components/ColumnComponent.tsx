import { ReactNode } from "react";
import { Box } from "@mui/material";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Column, Task } from "data";
import { TaskComponent } from "./TaskComponent";

const Title = ({ children }: { children: ReactNode }) => (
  <Box fontWeight={"bold"} fontSize={"1.17em"} p={"8px"}>
    {children}
  </Box>
);

export function ColumnComponent({
  column,
  tasks,
}: {
  column: Column;
  tasks: Task[];
}) {
  return (
    <Box m={"8px"} border={"1px solid lightgrey"} borderRadius={"2px"}>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided: DroppableProvided, snapshot) => (
          <Box
            sx={{ transition: "background-color 0.2s ease" }}
            boxShadow={snapshot.isDraggingOver ? 2 : 0}
            bgcolor={snapshot.isDraggingOver ? "rgba(94,154,237,.9)" : "white"}
            p={"8px"}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => {
              return <TaskComponent key={task.id} task={task} index={index} />;
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
