import {
  ReactNode,
  useState,
  MouseEvent,
  ChangeEvent,
  SyntheticEvent,
} from "react";
import {
  Box,
  Button,
  Stack,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";
import { Column, Task } from "data";
import { useTasks } from "hooks";
import { cobaltBlue, lightBlue, transparentGrey } from "styles";
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

function AlertDialog({
  open,
  successCallback,
  onClose,
}: {
  open: boolean;
  successCallback: () => void;
  onClose: () => void;
}) {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant={"contained"}
            onClick={() => {
              successCallback();
            }}
            autoFocus
          >
            Ok
          </Button>
          <Button onClick={onClose} color={"inherit"}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export function ColumnComponent({
  column,
  tasks,
  index,
}: {
  column: Column;
  tasks: Task[];
  index: number;
}) {
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [titleField, setTitleField] = useState<string>(column.title);
  const [titleFieldError, setTitleFieldError] = useState<string>("");
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const { addTask, renameColumn, deleteColumn } = useTasks();

  function toggleHidden() {
    setShowArchived((curr) => !curr);
    handleMenuClose();
  }

  function handleMenuOpen(e: MouseEvent<SVGSVGElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleModalOpen() {
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setTitleFieldError("");
  }

  function handleModalTitleFieldChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 20) {
      setTitleFieldError("Name too long, 20 char or less.");
    } else {
      setTitleFieldError("");
    }
    setTitleField(e.target.value);
  }

  function handleModalFormSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (titleField.length < 1) {
      setTitleFieldError("Title field is required.");
      return;
    }

    if (titleField.length > 20) {
      setTitleFieldError("Name too long, 20 char or less.");
      return;
    }

    renameColumn(column.id, titleField);
    handleModalClose();
  }

  function handleMenuEditClick() {
    handleModalOpen();
    handleMenuClose();
  }

  function handleMenuAddClick() {
    addTask(column.id);
    handleMenuClose();
  }

  function handleMenuDeleteClick() {
    setAlertOpen(true);
    handleMenuClose();
  }

  function handleAlertClose() {
    setAlertOpen(false);
  }

  function handleAlertDeleteClick() {
    deleteColumn(column.id, index);
    handleAlertClose();
  }

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
                <MoreHorizIcon
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      color: cobaltBlue,
                    },
                  }}
                  onClick={handleMenuOpen}
                />
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
                  {
                    // eslint-disable-next-line array-callback-return
                    tasks.map((task, index) => {
                      if (!task.archived || showArchived) {
                        return (
                          <TaskComponent
                            key={task.id}
                            task={task}
                            index={index}
                            columnId={column.id}
                          />
                        );
                      }
                    })
                  }
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

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
                  <Box>Add New Item</Box>
                </Box>
              </Button>
            </Box>
          </Box>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleMenuEditClick}>Edit</MenuItem>
            <MenuItem onClick={toggleHidden}>
              {showArchived ? "Hide" : "Show"} Archived
            </MenuItem>
            <MenuItem onClick={handleMenuAddClick}>Add New Item</MenuItem>
            <MenuItem
              sx={{ color: "#D00" }}
              disabled={column.taskIds.length > 0}
              onClick={handleMenuDeleteClick}
            >
              Delete List
            </MenuItem>
          </Menu>
          <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={modalOpen}
            onClose={handleModalClose}
          >
            <Box
              sx={{
                outline: 0,
                borderRadius: 2,
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                border: "1px solid lightgrey",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <form onSubmit={handleModalFormSubmit} autoComplete={"off"}>
                <Stack gap={2}>
                  <input id={"id"} type="hidden" value={column.id} />
                  <TextField
                    variant={"standard"}
                    name={"listTitle"}
                    error={titleFieldError ? true : false}
                    helperText={titleFieldError}
                    fullWidth
                    size={"small"}
                    id={"listTitle"}
                    value={titleField}
                    label={"List Title"}
                    onChange={handleModalTitleFieldChange}
                  />
                  <Stack direction={"row"} justifyContent={"flex-end"} gap={2}>
                    <Button variant={"contained"} type={"submit"}>
                      Save
                    </Button>
                    <Button color={"inherit"} onClick={handleModalClose}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Modal>
          <AlertDialog
            open={alertOpen}
            successCallback={handleAlertDeleteClick}
            onClose={handleAlertClose}
          />
        </Box>
      )}
    </Draggable>
  );
}
