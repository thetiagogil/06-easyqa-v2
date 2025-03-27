"use client";
import { ProfileOverview } from "@/components/sections/profile-overview";
import { MainContainer } from "@/components/shared/main-container";
import { QuestionEntry } from "@/components/shared/question-entry";
import {
  useGetUserAnsweredQuestions,
  useGetUserById,
  useGetUserQuestions,
} from "@/hooks/use-user-api";
import { userName } from "@/lib/utils";
import { Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { id } = useParams();
  const { data: user } = useGetUserById(Number(id));
  const [tabIndex, tabSetIndex] = useState<number>(0);
  const { data: questions } = useGetUserQuestions(Number(id));
  const { data: answers } = useGetUserAnsweredQuestions(Number(id));

  return (
    <MainContainer
      navbarProps={{
        title: userName(user),
        hasBackButton: true,
      }}
    >
      <ProfileOverview user={user} />

      <Tabs
        value={tabIndex}
        onChange={(_event, value) => tabSetIndex(value as number)}
        sx={{ bgcolor: "transparent" }}
      >
        <TabList
          sx={{
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
          <Tab value={0}>Questions</Tab>
          <Tab value={1}>Answers</Tab>
        </TabList>
        <TabPanel value={0} sx={{ p: 0 }}>
          {questions?.length ? (
            questions.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))
          ) : (
            <Typography level="body-sm" textAlign="center" mt={4}>
              No questions yet.
            </Typography>
          )}
        </TabPanel>
        <TabPanel value={1} sx={{ p: 0 }}>
          {answers?.length ? (
            answers.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))
          ) : (
            <Typography level="body-sm" textAlign="center" mt={4}>
              no answers yet
            </Typography>
          )}
        </TabPanel>
      </Tabs>
    </MainContainer>
  );
}
