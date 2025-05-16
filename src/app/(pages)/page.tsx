"use client";
import { ConnectButton } from "@/components/shared/connect-button";
import { MainContainer } from "@/components/shared/main-container";
import { QuestionEntry } from "@/components/shared/question-entry";
import {
  useGetHotQuestions,
  useGetNewQuestions,
  useGetTopQuestions,
} from "@/hooks/use-question-api";
import { Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [tabIndex, tabSetIndex] = useState<number>(0);
  const { data: newQuestions } = useGetNewQuestions();
  const { data: topQuestions } = useGetTopQuestions();
  const { data: hotQuestions } = useGetHotQuestions();

  const tabs = [
    {
      label: "new",
      value: 0,
      content: newQuestions?.map((question: QuestionModel) => (
        <QuestionEntry key={question.id} question={question} />
      )),
    },
    {
      label: "top",
      value: 1,
      content: topQuestions?.map((question: QuestionModel) => (
        <QuestionEntry key={question.id} question={question} />
      )),
    },
    {
      label: "hot",
      value: 2,
      content: hotQuestions?.map((question: QuestionModel) => (
        <QuestionEntry key={question.id} question={question} />
      )),
    },
  ];

  return (
    <MainContainer navbarProps={{ title: "home", endItem: <ConnectButton /> }}>
      <Tabs
        value={tabIndex}
        onChange={(_event, value) => tabSetIndex(value as number)}
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
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        {tabs.map((tab) => (
          <TabPanel key={tab.value} value={tab.value} sx={{ p: 0 }}>
            {tab.content}
          </TabPanel>
        ))}
      </Tabs>
    </MainContainer>
  );
}
