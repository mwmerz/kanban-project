import { Box, Stack } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Handle } from "./Handle";
import { Task } from "data";
import { getRelativeTimeString } from "util/format";

export function TaskComponent({ task, index }: { task: Task; index: number }) {
  const rtf = getRelativeTimeString(task.dateCreated);
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
          <Stack direction={"row"} width={"100%"}>
            <Handle {...provided.dragHandleProps} />
            <Stack width={"100%"}>
              <Box fontWeight={"bold"}>{task.name}</Box>
              <Box fontSize={".9em"}>{task.description}</Box>

              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Box fontSize={".75em"}>created: {rtf}</Box>
              </Box>
              <Box>
                {task.status === "Open" ? (
                  <img
                    alt={"open"}
                    src={
                      "https://img.shields.io/static/v1?&label=Status&message=Open&color=1b44a1&style=flat"
                    }
                  />
                ) : (
                  <img
                    alt={"closed"}
                    src={
                      "https://img.shields.io/static/v1?&label=Status&message=Closed&color=A41A20&style=flat"
                    }
                  />
                )}
              </Box>
            </Stack>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
