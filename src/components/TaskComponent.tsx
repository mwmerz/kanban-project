import { Box } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Handle } from "./Handle";
import { Task } from "data";

export function TaskComponent({ task, index }: { task: Task; index: number }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          display={"flex"}
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
          ref={provided.innerRef}
        >
          <Handle {...provided.dragHandleProps} />
          {task.content}
        </Box>
      )}
    </Draggable>
  );
}
