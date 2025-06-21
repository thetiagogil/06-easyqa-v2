"use client";
import { MainContainer } from "@/components/shared/main-container";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { List, ListDivider, ListItem, Stack, Switch, Typography } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";

export default function SettingsPage() {
  const { user, linkEmail, unlinkEmail, linkGoogle, unlinkGoogle, linkWallet, unlinkWallet } =
    usePrivy();

  const accounts = [
    {
      label: "email",
      isLinked: !!user?.email,
      link: () => linkEmail(),
      unlink: () => {
        if (user?.email?.address) unlinkEmail(user.email.address);
      },
    },
    {
      label: "google",
      isLinked: !!user?.google,
      link: () => linkGoogle(),
      unlink: () => {
        if (user?.google?.subject) unlinkGoogle(user.google.subject);
      },
    },
    {
      label: "wallet",
      isLinked: !!user?.wallet,
      link: () => linkWallet(),
      unlink: () => {
        if (user?.wallet?.address) unlinkWallet(user.wallet.address);
      },
    },
  ];

  return (
    <MainContainer navbarProps={{ title: "settings", hasBackButton: true }}>
      <Stack gap={2}>
        <Typography level="h4">Connections</Typography>
        <List variant="outlined" sx={{ borderRadius: "sm", flex: 0 }}>
          {accounts.map((account, index) => {
            const { label, isLinked, link, unlink } = account;
            return (
              <Stack key={index}>
                <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Stack flexDirection="row" alignItems="center" gap={1}>
                    <Typography textColor={!isLinked ? "neutral.600" : ""}>
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </Typography>
                    {isLinked && <CheckCircleIcon color="success" />}
                  </Stack>

                  <Switch
                    checked={isLinked}
                    onChange={() => (isLinked ? unlink() : link())}
                    disabled={user?.linkedAccounts.length === 1 && isLinked}
                  />
                </ListItem>
                {index !== accounts.length - 1 && <ListDivider component="li" />}
              </Stack>
            );
          })}
        </List>
      </Stack>
    </MainContainer>
  );
}
