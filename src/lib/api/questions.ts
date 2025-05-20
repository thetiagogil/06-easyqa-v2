export async function fetchQuestions(sort: "new" | "top" | "hot") {
  const res = await fetch(`/api/questions?sort=${sort}`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function fetchQuestionById(id: string) {
  const res = await fetch(`/api/questions?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}
