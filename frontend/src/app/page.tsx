"use client";
import { QuestionEntry } from "@/components/shared/question-entry";
import { useGetQuestions } from "@/hooks/use-question-api";
import { Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const { data: questions } = useGetQuestions();

  const tabs = [
    {
      label: "new",
      value: 0,
      content: (
        <>
          {questions?.length &&
            questions.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))}
        </>
      ),
    },
    {
      label: "top",
      value: 1,
      content: <></>,
    },
    {
      label: "trending",
      value: 2,
      content: <></>,
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
