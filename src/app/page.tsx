"use client";
import { MainContainer } from "@/components/shared/main-container";
import { Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const tabs = [{ label: "new" }, { label: "top" }, { label: "hot" }];

  return (
    <MainContainer navbarProps={{ title: "home" }}>
      <Tabs
        value={currentTabIndex}
        onChange={(_e, value) => {
          if (typeof value === "number") {
            setCurrentTabIndex(value);
          }
        }}
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
              "&:hover": { bgcolor: "transparent" },
              [`&.${tabClasses.selected}`]: { color: "primary.plainColor" },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={tab.label} value={index}>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: 0 }}>
            {
              <Typography level="body-sm" textAlign="center" p={2}>
                No {tab.label} questions yet.
              </Typography>
            }
          </TabPanel>
        ))}
      </Tabs>
    </MainContainer>
  );
}
