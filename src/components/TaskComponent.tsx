import { Box } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Task } from "data";

export function TaskComponent({ task, index }: { task: Task; index: number }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          color={snapshot.isDragging ? "white" : ""}
          boxShadow={snapshot.isDragging ? 2 : 0}
          bgcolor={snapshot.isDragging ? "rgba(27,68,161,.9)" : "white"}
          border={"1px solid"}
          borderColor={
            snapshot.isDragging ? "rgba(94,154,237,.9)" : "lightgrey"
          }
          borderRadius={"2px"}
          mb={"8px"}
          p={"8px"}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.content}
        </Box>
      )}
    </Draggable>
  );
}
