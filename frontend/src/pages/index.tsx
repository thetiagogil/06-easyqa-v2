import { MainContainer } from "@/components/shared/main-container";
import "@/styles/globals.css";
import { Box, Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [index, setIndex] = useState(0);

  return (
    <MainContainer>
      <Box sx={{ flexGrow: 1, overflowX: "hidden" }}>
        <Tabs
          aria-label="Sticky tabs"
          value={index}
          onChange={(_event, value) => setIndex(value as number)}
          sx={{ bgcolor: "transparent" }}
        >
          <TabList
            sticky="top"
            sx={{
              bgcolor: "transparent",
              position: "sticky",
              top: 0,
              zIndex: 1,
              justifyContent: "center",
              [`&& .${tabClasses.root}`]: {
                flex: 1,
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                },
                [`&.${tabClasses.selected}`]: {
                  color: "primary.plainColor",
                  "&::after": {
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    bgcolor: "primary.500",
                  },
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
      </Box>
    </MainContainer>
  );
}
