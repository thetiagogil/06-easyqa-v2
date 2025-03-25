"use client";
import { MainContainer } from "@/components/shared/main-container";

export default function SearchPage() {
  return (
    <MainContainer navbarProps={{ title: "search", hasBackButton: true }}>
      Search
    </MainContainer>
  );
}
