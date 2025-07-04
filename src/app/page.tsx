"use client";
import { Loading } from "@/components/shared/loading";
import { MainContainer } from "@/components/shared/main-container";
import { TargetEntry } from "@/components/shared/target-entry";
import { useGetQuestions } from "@/hooks/useQuestionApi";
import { Question } from "@/types/question";
import { Button, Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import { useMemo, useState } from "react";

export default function HomePage() {
  const { authenticated, login } = usePrivy();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const isNewTab = currentTabIndex === 0;
  const isTopTab = currentTabIndex === 1;
  const { data: newQuestions, isPending: isPendingNew } = useGetQuestions("new", 1, 10, isNewTab);
  const { data: topQuestions, isPending: isPendingTop } = useGetQuestions("top", 1, 10, isTopTab);

  const tabs = useMemo(
    () => [
      { label: "new", data: newQuestions, isPending: isPendingNew },
      { label: "top", data: topQuestions, isPending: isPendingTop },
    ],
    [newQuestions, topQuestions],
  );

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
      noPad
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
            {tab.isPending ? (
              <Loading minHeight={160} />
            ) : tab.data && tab.data.length > 0 ? (
              tab.data.map((question: Question, questionIndex) => (
                <TargetEntry
                  key={question.id}
                  targetType="question"
                  target={question}
                  isLastTarget={questionIndex === (tab.data && tab.data.length - 1)}
                />
              ))
            ) : (
              <Typography level="body-sm" textAlign="center" p={2}>
                No {tab.label} questions yet.
              </Typography>
            )}
          </TabPanel>
        ))}
      </Tabs>
    </MainContainer>
  );
}
