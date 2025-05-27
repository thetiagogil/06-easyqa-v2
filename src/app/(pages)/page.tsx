"use client";
import { ConnectButton } from "@/components/shared/connect-button";
import { Loading } from "@/components/shared/loading";
import { MainContainer } from "@/components/shared/main-container";
import { QuestionEntry } from "@/components/shared/question-entry";
import { useAuthContext } from "@/contexts/user.context";
import { useGetQuestions } from "@/hooks/use-question-api";
import { Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useMemo, useState } from "react";

export default function HomePage() {
  const { authReady } = useAuthContext();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));

  const hasTabBeenVisited = (index: number) => visitedTabs.has(index);

  const { data: newQuestions, isLoading: isLoadingNew } = useGetQuestions(
    "new",
    hasTabBeenVisited(0)
  );
  const { data: topQuestions, isLoading: isLoadingTop } = useGetQuestions(
    "top",
    hasTabBeenVisited(1)
  );
  const { data: hotQuestions, isLoading: isLoadingHot } = useGetQuestions(
    "hot",
    hasTabBeenVisited(2)
  );

  const tabs = useMemo(
    () => [
      { label: "new", data: newQuestions, isLoading: isLoadingNew },
      { label: "top", data: topQuestions, isLoading: isLoadingTop },
      { label: "hot", data: hotQuestions, isLoading: isLoadingHot },
    ],
    [newQuestions, topQuestions, hotQuestions]
  );

  if (!authReady) {
    return (
      <MainContainer navbarProps={{ title: "home" }}>
        <Loading minHeight={240} />
      </MainContainer>
    );
  }

  return (
    <MainContainer navbarProps={{ title: "home", endItem: <ConnectButton /> }}>
      <Tabs
        value={currentTabIndex}
        onChange={(_e, value) => {
          if (typeof value === "number") {
            setCurrentTabIndex(value);
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
