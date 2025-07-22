"use client";
import { MainContainer } from "@/components/layout/main-container";
import { CustomAvatar } from "@/components/shared/custom-avatar";
import { Loading } from "@/components/shared/loading";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGetUsers } from "@/hooks/useUserApi";
import { MAIN_BORDERS } from "@/lib/constants";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Input,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from "@mui/joy";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ExplorePage() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebouncedValue(search, 1000);
  const { data, fetchNextPage, hasNextPage, isPending, isFetching, isFetchingNextPage } =
    useGetUsers(debouncedSearch);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsSearching(true);
  };

  const users = data?.pages.flat() || [];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFetching && debouncedSearch === search) {
      setIsSearching(false);
    }
  }, [isFetching, debouncedSearch, search]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 },
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainContainer
      navbarProps={{
        title: "explore",
        hasBackButton: true,
        fullItem: (
          <Input
            placeholder="search for a user..."
            fullWidth
            startDecorator={<SearchIcon />}
            value={search}
            onChange={handleSearchChange}
            endDecorator={isSearching ? <CircularProgress size="sm" thickness={1} /> : null}
            aria-label="search users"
          />
        ),
      }}
      noPad
    >
      {isPending ? (
        <Loading />
      ) : (
        <>
          <List sx={{ p: 0 }}>
            {users.map((user) => (
              <ListItem key={user.id} sx={{ borderBottom: MAIN_BORDERS, p: 0 }}>
                <ListItemContent
                  component={NextLink}
                  href={`/profile/${user.id}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    gap: 2,
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "neutral.700",
                    },
                  }}
                >
                  <CustomAvatar user={user} size={32} fontSize={12} />

                  <Typography level="title-sm" color="primary" fontWeight={700}>
                    {user.name}
                  </Typography>
                  <Typography level="body-sm" noWrap>
                    {user.bio}
                  </Typography>
                </ListItemContent>
              </ListItem>
            ))}
          </List>

          {hasNextPage && <Box ref={loadMoreRef} />}
        </>
      )}
    </MainContainer>
  );
}
