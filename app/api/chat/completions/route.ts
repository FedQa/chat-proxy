import {client_api} from "@/app/api/_lib/api";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const requestBody = await req.json();
        const {data} = requestBody;
        const {messages, userData, tools} = data;
        const instruction = `You are an expert resume assistant. Your ONLY purpose is to help users create, improve, or analyze resumes.

**Strict Rule**:  
If the user's message is NOT about a resume (e.g., general career advice, coding questions, unrelated topics, small talk, etc.) respond that he should answer only about resume.

This is an example for payload of userData:
{
  "target_role": "",
  "resume": {
      "projects": [],
      "skills": [],
      "education": [],
      "work_experience": []
  },
  "job": ""
}


If "projects", "skills", "education", "work_experience" or other fields are empty, fill them out yourself as realistic examples.

Expected resume structure:
{
  "first_name": string | undefined,
  "last_name": string | undefined,
  "email": string | undefined,
  "phone_number": string | undefined,
  "location": string | undefined,
  "website": string | undefined,
  "linkedin_url": string | undefined,
  "github_url": string | undefined,
  "target_role": string | undefined,
  "work_experience": Array<{
    "company": string,
    "position": string,
    "location"?: string,
    "date": string,
    "description": string[],
    "technologies"?: string[]
  }> | undefined,
  "education": Array<{
    "school": string,
    "degree": string,
    "field": string,
    "location"?: string,
    "date": string,
    "gpa"?: number | string,
    "achievements"?: string[]
  }> | undefined,
  "skills": Array<{
    "category": string,
    "items": string[]
  }> | undefined,
  "projects": Array<{
    "name": string,
    "description": string[],
    "date"?: string,
    "technologies"?: string[],
    "url"?: string,
    "github_url"?: string
  }> | undefined,
  "explanation": string | undefined
}`;
        const client = client_api();
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role: "system", content: instruction},
                {role: "user", content: messages},
            ],
            tools: tools,
            response_format: { type: "json_object" },
        });

        console.log("completion", completion);

        let parsed;

        if (!completion) {
            return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
        } else {
            try {
                parsed = completion;
            } catch(e) {
                console.error("Failed to parse AI response:", completion);
                return NextResponse.json(
                    { error: "Invalid JSON from AI", raw: completion },
                    { status: 500 }
                );
            }
        }


        return NextResponse.json({
            resumeUpdate: parsed,
        })} catch(error) {
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}