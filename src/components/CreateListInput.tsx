import { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTasks } from "hooks";

function AlertDialog({
  open,
  successCallback,
  setOpen,
}: {
  open: boolean;
  successCallback: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Box>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to clear the storage? This will set this board
            back to the default items.
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
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export function CreateListInput() {
  const [listName, setListName] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [confirmAlertOpen, setConfirmAlertOpen] = useState<boolean>(false);
  const { clearState, addColumn } = useTasks();

  function handleClearConfirm() {
    setConfirmAlertOpen(false);
    clearState();
  }

  // handle list updates, add validation, etc
  // TODO: Validation
  function handleListUpdate(name: string) {
    if (name.length > 20) {
      setInputError("Name too long, 20 char or less.");
    } else {
      setInputError("");
    }
    setListName(name);
  }

  function handleCreateClick(name: string) {
    // TODO: validate even more.
    if (name.length < 1) setInputError("Name too short");
    if (name.length > 0 && name.length <= 20) {
      handleListUpdate("");
      addColumn(name);
    }
  }

  return (
    <Box p={"8px"} display={"flex"} justifyContent={"center"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateClick(listName);
        }}
      >
        <Stack gap={2} direction={["column", "row"]} alignItems={"flex-start"}>
          <TextField
            autoComplete={"off"}
            style={{ width: 300 }}
            error={inputError ? true : false}
            helperText={inputError}
            size={"small"}
            id="list-name"
            label="Create New List"
            variant="outlined"
            value={listName}
            onChange={(e) => {
              handleListUpdate(e.target.value);
            }}
          />
          <Stack gap={1} direction={"row"}>
            <Button type={"submit"} variant={"contained"}>
              Create List
            </Button>
            <Button
              variant={"contained"}
              color={"error"}
              onClick={() => {
                setConfirmAlertOpen(true);
              }}
            >
              Clear Storage
            </Button>
          </Stack>
        </Stack>
      </form>
      <AlertDialog
        open={confirmAlertOpen}
        successCallback={handleClearConfirm}
        setOpen={setConfirmAlertOpen}
      />
    </Box>
  );
}
