"use client";
import { MainContainer } from "@/components/shared/main-container";
import { useAuthContext } from "@/contexts/auth.context";
import { Button, Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { authenticated, login } = usePrivy();
  const { isUserReady, loading } = useAuthContext();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated && !isUserReady) {
      router.replace("/setup");
    }
  }, [loading, authenticated, isUserReady, router]);

  const tabs = [{ label: "new" }, { label: "top" }, { label: "hot" }];

  return (
    <MainContainer
      navbarProps={{
        title: "home",
        endItem: !authenticated && (
          <Button size="sm" onClick={login}>
            Login
          </Button>
        ),
      }}
      hasTabs
    >
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
