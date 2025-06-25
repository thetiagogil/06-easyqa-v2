"use client";
import { Loading } from "@/components/shared/loading";
import { MainContainer } from "@/components/shared/main-container";
import { QuestionEntry } from "@/components/shared/question-entry";
import {
  useGetUserAnsweredQuestions,
  useGetUserById,
  useGetUserQuestions,
} from "@/hooks/useUserApi";
import { userAvatar, userName } from "@/lib/utils";
import { Question } from "@/types/question";
import { User } from "@/types/user";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  IconButton,
  Stack,
  Tab,
  tabClasses,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { useParams } from "next/navigation";
import { useState } from "react";

export const ProfileOverview = ({ user }: { user?: User }) => {
  return (
    <Stack p={2} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Avatar
          size="lg"
          src={userAvatar(user)}
          alt={userName(user)}
          sx={{ height: 80, width: 80 }}
        />

        <Stack>
          <IconButton variant="outlined" size="sm">
            <EditIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Typography level="h2">{userName(user)}</Typography>

      <Typography level="body-sm">{user?.bio}</Typography>
    </Stack>
  );
};

export default function ProfilePage() {
  const { id } = useParams();
  const userId = Number(id);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const isQuestionsTab = currentTabIndex === 0;
  const isAnswersTab = currentTabIndex === 1;

  const { data: user } = useGetUserById(userId);
  const { data: questions, isLoading: isQuestionsLoading } = useGetUserQuestions(
    userId,
    isQuestionsTab,
  );
  const { data: answeredQuestions, isLoading: isAnsweredQuestionsLoading } =
    useGetUserAnsweredQuestions(userId, isAnswersTab);

  return (
    <MainContainer
      navbarProps={{
        title: userName(user),
        hasBackButton: true,
      }}
      hasTabs
    >
      <ProfileOverview user={user} />

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
            questions.map((question: Question, questionIndex) => (
              <QuestionEntry
                key={question.id}
                question={question}
                isLastQuestion={questionIndex === questions!.length - 1}
              />
            ))
          ) : (
            <Typography level="body-sm" textAlign="center" p={2}>
              No questions yet.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={1} sx={{ p: 0 }}>
          {isAnsweredQuestionsLoading ? (
            <Loading />
          ) : answeredQuestions?.length ? (
            answeredQuestions.map((question: Question, questionIndex) => (
              <QuestionEntry
                key={question.id}
                question={question}
                isLastQuestion={questionIndex === answeredQuestions!.length - 1}
              />
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
