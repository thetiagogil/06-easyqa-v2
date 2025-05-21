"use client";
import { ConnectButton } from "@/components/shared/connect-button";
import { Loading } from "@/components/shared/loading";
import { MainContainer } from "@/components/shared/main-container";
import { QuestionEntry } from "@/components/shared/question-entry";
import {
  useGetHotQuestions,
  useGetNewQuestions,
  useGetTopQuestions,
} from "@/hooks/use-question-api";
import { Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));
  const { data: newQuestions, isLoading: isNewLoading } = useGetNewQuestions({
    enabled: visitedTabs.has(0),
  });
  const { data: topQuestions, isLoading: isTopLoading } = useGetTopQuestions({
    enabled: visitedTabs.has(1),
  });
  const { data: hotQuestions, isLoading: isHotLoading } = useGetHotQuestions({
    enabled: visitedTabs.has(2),
  });

  const tabs = [
    {
      label: "new",
      data: newQuestions,
      isLoading: isNewLoading,
    },
    {
      label: "top",
      data: topQuestions,
      isLoading: isTopLoading,
    },
    {
      label: "hot",
      data: hotQuestions,
      isLoading: isHotLoading,
    },
  ];

  const handleTabChange = (_: any, value: string | number | null) => {
    if (typeof value === "number") {
      setTabIndex(value);
      setVisitedTabs((prev) => new Set(prev).add(value));
    }
  };

  return (
    <MainContainer navbarProps={{ title: "home", endItem: <ConnectButton /> }}>
      <Tabs
        value={tabIndex}
        onChange={(_, value) => {
          if (typeof value === "number") {
            setTabIndex(value);
            setVisitedTabs((prev) => new Set(prev).add(value));
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
              [`&.${tabClasses.selected}`]: {
                color: "primary.plainColor",
              },
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
            {tab.isLoading ? (
              <Loading minHeight={160} />
            ) : !tab.data?.length ? (
              <Typography level="body-sm" textAlign="center" p={2}>
                No {tab.label} questions yet.
              </Typography>
            ) : (
              tab.data.map((question: QuestionModel) => (
                <QuestionEntry key={question.id} question={question} />
              ))
            )}
          </TabPanel>
        ))}
      </Tabs>
    </MainContainer>
  );
}
