"use client";
import { MainContainer } from "@/components/layout/main-container";
import { ControlledField } from "@/components/ui/controlled-input";
import { useAuthContext } from "@/contexts/auth.context";
import { useUpdateUser } from "@/hooks/useUserApi";
import { CHAR_LIMIT } from "@/lib/constants";
import { Button, Stack } from "@mui/joy";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  bio: string;
};

export default function ProfileEditPage() {
  const { id } = useParams();
  const userId = Number(id);
  const { currentUser } = useAuthContext();
  const { mutateAsync: updateUser, isPending, isSuccess } = useUpdateUser();
  const router = useRouter();
  const isCurrentUser = currentUser?.id === userId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: currentUser?.name || "",
      bio: currentUser?.bio || "",
    },
  });
  const name = watch("name") || "";
  const bio = watch("bio") || "";

  const isValidLength =
    name.length > 0 &&
    name.length <= CHAR_LIMIT.PROFILE_NAME &&
    bio.length <= CHAR_LIMIT.PROFILE_BIO;

  const onSubmit = async (data: FormData) => {
    if (!isValidLength) return;
    await updateUser(data);
  };

  useEffect(() => {
    if (!isCurrentUser) {
      router.replace(`/profile/${userId}`);
    }
  }, [currentUser, isCurrentUser, userId, router]);

  useEffect(() => {
    if (isSuccess && currentUser?.id) {
      router.replace(`/profile/${currentUser!.id}`);
    }
  }, [currentUser, isSuccess, router]);

  if (!isCurrentUser) return null;
  return (
    <MainContainer
      navbarProps={{
        title: "edit profile",
        hasBackButton: true,
      }}
      noPad
    >
      <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack p={2} gap={3}>
          <ControlledField
            type="input"
            name="name"
            label="Name"
            value={name}
            maxLength={100}
            register={register}
            error={errors.name}
            disabled={isSubmitting}
          />

          <ControlledField
            type="textarea"
            name="bio"
            label="Bio"
            value={bio}
            maxLength={160}
            register={register}
            error={errors.bio}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            form="edit-profile-form"
            size="sm"
            loading={isSubmitting || isPending}
            disabled={!isValidLength}
          >
            Save
          </Button>
        </Stack>
      </form>
    </MainContainer>
  );
}
