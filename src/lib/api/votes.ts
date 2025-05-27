export async function submitVote(
  userId: number,
  targetId: string,
  targetType: "question" | "answer",
  voteType: "upvote" | "downvote"
) {
  const res = await fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      type: voteType,
    }),
  });

  if (!res.ok) throw new Error("Failed to submit vote");
  return res.json();
}
