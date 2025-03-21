"use client";
import { Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [index, setIndex] = useState(0);

  return (
    <Tabs
      value={index}
      onChange={(_event, value) => setIndex(value as number)}
      sx={{ bgcolor: "transparent" }}
    >
      <TabList
        sticky="top"
        sx={{
          top: 56,
          justifyContent: "center",
          [`&& .${tabClasses.root}`]: {
            flex: 1,
            bgcolor: "transparent",
            "&:hover": {
              bgcolor: "transparent",
            },
            [`&.${tabClasses.selected}`]: {
              color: "primary.plainColor",
            },
          },
        }}
      >
        <Tab>new</Tab>
        <Tab>top</Tab>
        <Tab>trending</Tab>
      </TabList>

      <TabPanel value={0}>new</TabPanel>
      <TabPanel value={1}>top</TabPanel>
      <TabPanel value={2}>trending</TabPanel>
    </Tabs>
  );
}
