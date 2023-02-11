import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useTasks } from "hooks";

export function CreateListInput() {
  const [listName, setListName] = useState<string>("");
  const { clearState, addColumn } = useTasks();

  // handle list updates, add validation, etc
  // TODO: Validation
  function handleListUpdate(name: string) {
    setListName(name);
  }

  function handleCreateClick(name: string) {
    // TODO: validate even more.
    if (name.length > 0) addColumn(name);
    handleListUpdate("");
  }

  return (
    <Box p={"8px"}>
      <Stack gap={2} direction={["column", "row"]}>
        <TextField
          style={{ width: 300 }}
          id="list-name"
          label="Create New List"
          variant="outlined"
          value={listName}
          onChange={(e) => {
            handleListUpdate(e.target.value);
          }}
        />
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
    </Box>
  );
}
