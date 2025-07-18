"use client";
import { MainContainer } from "@/components/layout/main-container";
import { CustomAvatar } from "@/components/shared/custom-avatar";
import { Loading } from "@/components/shared/loading";
import { TargetEntry } from "@/components/shared/target-entry";
import { useAuthContext } from "@/contexts/auth.context";
import {
  useGetUserAnsweredQuestions,
  useGetUserById,
  useGetUserQuestions,
} from "@/hooks/useUserApi";
import { userName } from "@/lib/utils";
import { Question } from "@/types/question";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { id } = useParams();
  const userId = Number(id);
  const { currentUser } = useAuthContext();
  const router = useRouter();

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const isQuestionsTab = currentTabIndex === 0;
  const isAnswersTab = currentTabIndex === 1;

  const { data: user, isPending: isPendingUser } = useGetUserById(userId);
  const { data: questions, isLoading: isQuestionsLoading } = useGetUserQuestions(
    userId,
    isQuestionsTab,
  );
  const { data: answeredQuestions, isLoading: isAnsweredQuestionsLoading } =
    useGetUserAnsweredQuestions(userId, isAnswersTab);

  if (isPendingUser) return <Loading variant="overlay" />;
  return (
    <MainContainer
      navbarProps={{
        title: "profile",
        hasBackButton: true,
      }}
      noPad
    >
      <Stack p={2} gap={2}>
        <Stack direction="row" justifyContent="space-between">
          <CustomAvatar user={user!} size={80} fontSize={32} />

          {user?.id === currentUser?.id && (
            <Stack>
              <IconButton
                variant="outlined"
                size="sm"
                onClick={() => {
                  if (user?.id) {
                    router.push(`/profile/${user.id}/edit`);
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>

        <Typography level="h2">{userName(user)}</Typography>

        <Typography level="body-sm">{user?.bio}</Typography>
      </Stack>

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
            questions.map((question: Question) => (
              <TargetEntry key={question.id} targetType="question" target={question} />
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
            answeredQuestions.map((question: Question) => (
              <TargetEntry key={question.id} targetType="question" target={question} />
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
