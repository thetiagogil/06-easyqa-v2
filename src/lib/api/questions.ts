export async function getQuestions(
  sort: "new" | "top" | "hot",
  userId?: number
) {
  const url = new URL("/api/questions", window.location.origin);
  url.searchParams.set("sort", sort);
  if (userId) url.searchParams.set("user_id", String(userId));
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function getQuestionById(id: string) {
  const res = await fetch(`/api/questions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}
