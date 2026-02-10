import {client_api} from "@/app/api/_lib/api";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const requestBody = await req.json();
        const {data} = requestBody;
        const {messages, userData} = data;
        const instruction = `You are an expert resume assistant. Your task is to generate or improve a resume based on the user's request.
      TOOL USAGE INSTRUCTIONS:
      1. For work experience improvements:
         - Use 'suggest_work_experience_improvement' with 'index' and 'improved_experience' fields
         - Always include company, position, date, and description

      2. For project improvements:
         - Use 'suggest_project_improvement' with 'index' and 'improved_project' fields
         - Always include name and description

      3. For skill improvements:
         - Use 'suggest_skill_improvement' with 'index' and 'improved_skill' fields
         - Only use for adding new or removing existing skills

      4. For education improvements:
         - Use 'suggest_education_improvement' with 'index' and 'improved_education' fields
         - Always include school, degree, field, and date

      5. For viewing resume sections:
         - Use 'getResume' with 'sections' array
         - Valid sections: 'all', 'personal_info', 'work_experience', 'education', 'skills', 'projects'

      6. For multiple section updates:
         - Use 'modifyWholeResume' when changing multiple sections at once

      Aim to use a maximum of 5 tools in one go, then confirm with the user if they would like you to continue.
      The target role is ${userData.target_role}. The job is ${userData.job ? JSON.stringify(userData.job) : 'No job specified'}.
      // Current resume summary: ${userData.resume ? `${userData.resume.first_name} ${userData.resume.last_name} - ${userData.resume.target_role}` : 'No resume data'}.
      \`;
      This is example for payload of userData:
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
      If "projects","skills","education","work_experience" or others are empty, then fill it out yourself as an example. 
      Expected structure:
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
            "date": string,        // e.g., "Mar 2022 – Present" or "2021–2022"
            "description": string[], // list of bullet points as plain strings (no markdown)
            "technologies"?: string[]
          }> | undefined,
          "education": Array<{
            "school": string,
            "degree": string,
            "field": string,
            "location"?: string,
            "date": string,        // e.g., "2017–2021"
            "gpa"?: number | string,
            "achievements"?: string[]
          }> | undefined,
          "skills": Array<{
            "category": string,    // e.g., "Languages", "Frameworks"
            "items": string[]      // e.g., ["JavaScript", "TypeScript"]
          }> | undefined,
          "projects": Array<{
            "name": string,
            "description": string[], // list of bullet points as plain strings
            "date"?: string,
            "technologies"?: string[],
            "url"?: string,
            "github_url"?: string
          }> | undefined,
          "explanation": string | undefined  // optional: short summary for chat UI
        }`;
        const client = client_api();
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role: "system", content: instruction},
                {role: "user", content: messages},
            ],
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