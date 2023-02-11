import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export function Handle({ ...rest }) {
  return (
    <Box {...rest} display={"flex"} mr={2}>
      <DragIndicatorIcon />
    </Box>
  );
}
