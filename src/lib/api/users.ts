export async function fetchUserById(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchUserQuestions(userId: string) {
  const res = await fetch(`/api/users/${userId}/questions`);
  if (!res.ok) throw new Error("Failed to fetch user questions");
  return res.json();
}

export async function fetchUserAnsweredQuestions(userId: string) {
  const res = await fetch(`/api/users/${userId}/answers`);
  if (!res.ok) throw new Error("Failed to fetch user answered questions");
  return res.json();
}

export async function createUserByWallet(wallet: string) {
  const res = await fetch(`/api/users/auth/${wallet}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}
