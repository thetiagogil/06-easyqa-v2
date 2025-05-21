"use client";

import { ProfileOverview } from "@/components/sections/profile-overview";
import { Loading } from "@/components/shared/loading";
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
  const userId = Number(id);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));

  const { data: user } = useGetUserById(userId);
  const { data: questions, isLoading: isQuestionsLoading } =
    useGetUserQuestions(userId, { enabled: visitedTabs.has(0) && !!userId });
  const { data: answers, isLoading: isAnswersLoading } =
    useGetUserAnsweredQuestions(userId, {
      enabled: visitedTabs.has(1) && !!userId,
    });

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
        onChange={(_, value) => {
          if (typeof value === "number") {
            setTabIndex(value);
            setVisitedTabs((prev) => new Set(prev).add(value));
          }
        }}
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
          {isQuestionsLoading ? (
            <Loading />
          ) : questions?.length ? (
            questions.map((question: QuestionModel) => (
              <QuestionEntry key={question.id} question={question} />
            ))
          ) : (
            <Typography level="body-sm" textAlign="center" p={2}>
              No questions yet.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={1} sx={{ p: 0 }}>
          {isAnswersLoading ? (
            <Loading />
          ) : answers?.length ? (
            answers.map((answer: QuestionModel) => (
              <QuestionEntry key={answer.id} question={answer} />
            ))
          ) : (
            <Typography level="body-sm" textAlign="center" p={2}>
              No answers yet.
            </Typography>
          )}
        </TabPanel>
      </Tabs>
    </MainContainer>
  );
}
