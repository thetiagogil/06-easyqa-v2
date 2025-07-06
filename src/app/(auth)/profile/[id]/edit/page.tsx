"use client";
import { MainContainer } from "@/components/shared/main-container";
import { useAuthContext } from "@/contexts/auth.context";
import { useSnackbarContext } from "@/contexts/snackbar.context";
import { useUpdateUser } from "@/hooks/useUserApi";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  bio: string;
};

const BIO_MAX_LENGTH = 160;

export default function ProfileEditPage() {
  const { id } = useParams();
  const userId = Number(id);
  const { currentUser } = useAuthContext();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const { showSnackbar } = useSnackbarContext();
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
  const bio = watch("bio") || "";

  const onSubmit = async (data: FormData) => {
    try {
      await updateUser({
        userId: currentUser!.id,
        data,
      });
    } catch (error: any) {
      console.error("Update failed:", error.message);
    } finally {
      router.replace(`/profile/${currentUser!.id}`);
      showSnackbar("Profile updated successfully", "success");
    }
  };

  useEffect(() => {
    if (!currentUser || !isCurrentUser) {
      router.replace(`/profile/${userId}`);
    }
  }, [currentUser, isCurrentUser, userId, router]);

  if (!currentUser || !isCurrentUser) return null;
  return (
    <MainContainer
      navbarProps={{
        title: "edit profile",
        hasBackButton: true,
        endItem: (
          <Button
            type="submit"
            form="edit-profile-form"
            size="sm"
            loading={isSubmitting || isPending}
          >
            Save
          </Button>
        ),
      }}
      noPad
    >
      <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack p={2} gap={3}>
          <FormControl error={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
              disabled={isSubmitting}
            />
            {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!errors.bio}>
            <FormLabel>Bio</FormLabel>
            <Textarea
              {...register("bio", {
                maxLength: {
                  value: BIO_MAX_LENGTH,
                  message: `Bio must be at most ${BIO_MAX_LENGTH} characters`,
                },
              })}
              placeholder="Write something about yourself..."
              minRows={3}
              disabled={isSubmitting}
              slotProps={{
                textarea: {
                  maxLength: BIO_MAX_LENGTH,
                },
              }}
            />
            <Typography level="body-xs" textAlign="right">
              {bio.length} / {BIO_MAX_LENGTH}
            </Typography>
            {errors.bio && <FormHelperText>{errors.bio.message}</FormHelperText>}
          </FormControl>
        </Stack>
      </form>
    </MainContainer>
  );
}
