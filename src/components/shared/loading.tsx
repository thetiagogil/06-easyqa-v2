import { Stack } from "@mui/joy";
import CircularProgress from "@mui/joy/CircularProgress";

interface LoadingProps {
  isLoading?: boolean;
  minHeight?: string | number;
  variant?: "overlay";
}

export const Loading = ({ isLoading = true, minHeight = 80, variant }: LoadingProps) => {
  if (!isLoading) return null;

  if (variant === "overlay") {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1300}
        bgcolor="rgba(9, 8, 24, 0.6)"
      >
        <CircularProgress color="neutral" size="lg" role="status" aria-busy="true" />
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" justifyContent="center" flexGrow={1} minHeight={minHeight}>
      <CircularProgress color="neutral" size="md" role="status" aria-busy="true" />
    </Stack>
  );
};
