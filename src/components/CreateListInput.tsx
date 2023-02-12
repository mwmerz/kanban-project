import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useTasks } from "hooks";

export function CreateListInput() {
  const [listName, setListName] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const { clearState, addColumn } = useTasks();

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
      <Stack gap={2} direction={["column", "row"]} alignItems={"flex-start"}>
        <TextField
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
          <Button
            variant={"contained"}
            onClick={() => {
              handleCreateClick(listName);
            }}
          >
            Create List
          </Button>
          <Button
            variant={"contained"}
            color={"error"}
            onClick={() => {
              clearState();
            }}
          >
            Clear Storage
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
