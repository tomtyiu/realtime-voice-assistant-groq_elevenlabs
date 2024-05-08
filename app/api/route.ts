import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // gotta use the request object to invalidate the cache every request :vomit:
  const url = request.url;
  const client = new ElevenLabsClient({apiKey: ELEVENLABS_API_KEY,});

  let { result: projectsResult, error: projectsError } =
    await client.manage.getProjects();

  if (projectsError) {
    return NextResponse.json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return NextResponse.json(
      new clientError(
        "Cannot find a Elevenlabs project. Please create a project first."
      )
    );
  }

  let { result: newKeyResult, error: newKeyError } =
    await client.manage.createProjectKey(project.project_id, {
      comment: "Temporary API key",
      scopes: ["usage:write"],
      tags: ["next.js"],
      time_to_live_in_seconds: 10,
    });

  if (newKeyError) {
    return NextResponse.json(newKeyError);
  }

  return NextResponse.json({ ...newKeyResult, url });
}
