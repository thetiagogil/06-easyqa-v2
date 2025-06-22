"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useUpdateUser } from "@/hooks/useUser";
import { Button, FormControl, FormHelperText, Input, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
};

export default function SetupPage() {
  const { currentUser } = useAuthContext();
  const { mutateAsync, isPending } = useUpdateUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({
        userId: currentUser!.id,
        name: data.name,
      });
    } catch (error: any) {
      console.error("Setup failed:", error.message);
    } finally {
      if (currentUser?.name) {
        router.replace("/");
      }
    }
  };

  useEffect(() => {
    if (!currentUser || currentUser?.name) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack minHeight="100vh" justifyContent="center" alignItems="center" p={2}>
        <Stack width="100%" maxWidth={400} gap={4}>
          <Typography level="h3" textAlign="center">
            Hi, please choose a name!
          </Typography>

          <Stack gap={2}>
            <FormControl error={!!errors.name}>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="name"
                disabled={isSubmitting}
              />
              {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
            </FormControl>

            <Button type="submit" loading={isSubmitting || isPending}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
