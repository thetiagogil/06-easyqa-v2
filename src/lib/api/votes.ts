export async function fetchVotesByTargetId(targetId: string) {
  const res = await fetch(`/api/votes/${targetId}`);
  if (!res.ok) throw new Error("Failed to fetch votes");
  return res.json();
}

export async function createVote(vote: {
  user_id: number;
  target_id: string;
  target_type: "question" | "answer";
  type: "upvote" | "downvote";
}) {
  const res = await fetch("/api/votes", {
    method: "POST",
    body: JSON.stringify(vote),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to submit vote");
  return res.json();
}
