"use client";

import { Box, Container, TextField } from "@mui/material";
import TagAutocomplete from "./components/TagAutocomplete";

export default function Home() {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <TagAutocomplete
          tags={_mockData}
          renderInputCustom={(params) => <TextField {...params} label="Tags" />}
        />
      </Box>
    </Container>
  );
}

const _mockData: { id: string; tag: string }[] = [
  { id: "1", tag: "test01" },
  { id: "2", tag: "test02" },
  { id: "3", tag: "tag01" },
  { id: "4", tag: "tag02" },
];
