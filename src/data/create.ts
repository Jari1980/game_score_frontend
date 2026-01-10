import type { CreateMatch } from "../data/matchModels";

export async function createMatch(
  url: string,
  payload: CreateMatch,
): Promise<number> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  //anything not 200 range
  if (!response.ok) {
    throw new Error(`Failed to create match: ${response.status}`);
  }

  return response.status;
}
