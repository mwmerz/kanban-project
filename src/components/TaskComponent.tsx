import { useState, MouseEvent, ChangeEvent, SyntheticEvent } from "react";
import {
  Box,
  Button,
  Stack,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Checkbox,
  InputLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Draggable } from "react-beautiful-dnd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTasks } from "hooks";
import { Handle } from "./Handle";
import { cobaltBlue } from "styles";
import { Task } from "data";
import { getRelativeTimeString } from "util/format";

export function TaskComponent({
  task,
  index,
  columnId,
}: {
  task: Task;
  index: number;
  columnId: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [nameField, setNameField] = useState<string>(task.name);
  const [archivedField, setArchivedField] = useState<boolean>(task.archived);
  const [nameError, setNameError] = useState<string>("");
  const [descriptionField, setDescriptionField] = useState<string>(
    task.description
  );
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [statusField, setStatusField] = useState<"Open" | "Closed">(
    task.status
  );

  const { editTask, deleteTask } = useTasks();

  const open = Boolean(anchorEl);

  function handleFormSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (nameField.length < 1) {
      setNameError("Name cannot be blank");
      return;
    }

    if (nameField.length > 20) {
      setNameError("Name cannot be over 20 characters.");
      return;
    }
    editTask(task.id, {
      ...task,
      name: nameField,
      description: descriptionField,
      status: statusField,
      archived: archivedField,
    });
    handleModalClose();
  }

  function handleStatusChange(e: SelectChangeEvent) {
    setStatusField(e.target.value as "Open" | "Closed");
  }

  function handleArchiveChange(e: ChangeEvent<HTMLInputElement>) {
    setArchivedField(e.target.checked);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "name") {
      setNameField(e.target.value);

      if (nameField.length > 20) {
        setNameError("Name cannot be over 20 characters.");
        return;
      }
      setNameError("");
    }

    if (e.target.id === "description") {
      setDescriptionField(e.target.value);
      setDescriptionError("");
    }
  }

  function handleModalOpen() {
    setModalOpen(true);
  }
  function handleModalClose() {
    setModalOpen(false);
    setNameError("");
    setDescriptionError("");
  }

  function handleMenuClick(e: MouseEvent<SVGSVGElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleEditClick() {
    //editTask(task.id, { ...task, name: new Date().valueOf().toString() });
    handleModalOpen();
    handleMenuClose();
  }

  function handleDeleteClick() {
    deleteTask(task.id, columnId, index);
    handleMenuClose();
  }

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
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            <MenuItem
              sx={{
                color: "#D00",
              }}
              onClick={handleDeleteClick}
            >
              Delete
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
              <form onSubmit={handleFormSubmit} autoComplete={"off"}>
                <Stack gap={2}>
                  <input id={"id"} type="hidden" value={task.id} />
                  <TextField
                    variant={"standard"}
                    name={"name"}
                    error={nameError ? true : false}
                    helperText={nameError}
                    fullWidth
                    size={"small"}
                    id={"name"}
                    value={nameField}
                    label={"Name"}
                    onChange={handleInputChange}
                  />
                  <TextField
                    variant={"standard"}
                    fullWidth
                    error={descriptionError ? true : false}
                    helperText={descriptionError}
                    size={"small"}
                    id={"description"}
                    label={"Description"}
                    value={descriptionField}
                    onChange={handleInputChange}
                  />
                  <input
                    id={"dateCreated"}
                    type="hidden"
                    value={task.dateCreated}
                  />
                  <FormControl fullWidth variant={"standard"}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      value={statusField}
                      label="Status"
                      onChange={handleStatusChange}
                    >
                      <MenuItem value={"Open"}>Open</MenuItem>
                      <MenuItem value={"Closed"}>Closed</MenuItem>
                    </Select>
                  </FormControl>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="archived"
                          value={archivedField}
                          defaultChecked={task.archived}
                          onChange={handleArchiveChange}
                        />
                      }
                      label="Archived"
                    />
                  </FormGroup>

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
          <Stack direction={"row"} width={"100%"}>
            <Handle mr={2} {...provided.dragHandleProps} />
            <Stack width={"100%"}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Box fontWeight={"bold"}>{task.name}</Box>
                <MoreHorizIcon
                  onClick={handleMenuClick}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: cobaltBlue,
                    },
                  }}
                />
              </Stack>
              <Box fontSize={".9em"}>{task.description}</Box>

              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Box fontSize={".75em"}>created: {rtf}</Box>
              </Box>
              <Stack direction={"row"} gap={1}>
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
                {task.archived && (
                  <img
                    alt={"archived"}
                    src={"https://img.shields.io/badge/-Archived-red"}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
}
