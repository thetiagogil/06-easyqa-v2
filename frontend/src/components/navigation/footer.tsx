import { Stack, Typography } from "@mui/joy";

export const Footer = () => {
  return (
    <Stack
      bgcolor="background.body"
      width="100%"
      position="sticky"
      bottom={0}
      alignItems="center"
      p={2}
      borderTop="solid 1px"
      borderColor="neutral.200"
      zIndex={10}
    >
      <Typography>Footer</Typography>
    </Stack>
  );
};
