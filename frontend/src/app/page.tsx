"use client";
import { QuestionEntry } from "@/components/shared/question-entry";
import {
  useGetHotQuestions,
  useGetNewQuestions,
  useGetTopQuestions,
} from "@/hooks/use-question-api";
import { Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const { data: newQuestions } = useGetNewQuestions();
  const { data: topQuestions } = useGetTopQuestions();
  const { data: hotQuestions } = useGetHotQuestions();

  const tabs = [
    {
      label: "new",
      value: 0,
      content: (
        <>
          {newQuestions?.length &&
            newQuestions.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))}
        </>
      ),
    },
    {
      label: "top",
      value: 1,
      content: (
        <>
          {topQuestions?.length &&
            topQuestions.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))}
        </>
      ),
    },
    {
      label: "hot",
      value: 2,
      content: (
        <>
          {hotQuestions?.length &&
            hotQuestions.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))}
        </>
      ),
    },
  ];

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
  );
}
