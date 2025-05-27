export async function createUserByWallet(wallet: string) {
  const res = await fetch(`/api/users/auth/${wallet}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function getUserById(id: number) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function getUserQuestions(userId: number) {
  const res = await fetch(`/api/users/${userId}/questions`);
  if (!res.ok) throw new Error("Failed to fetch user questions");
  return res.json();
}

export async function getUserAnsweredQuestions(userId: number) {
  const res = await fetch(`/api/users/${userId}/answers`);
  if (!res.ok) throw new Error("Failed to fetch user answered questions");
  return res.json();
}
