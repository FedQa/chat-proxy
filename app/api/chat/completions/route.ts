import {client_api} from "@/app/api/_lib/api";
import {NextResponse} from "next/server";
import {instruction} from "@/app/api/_lib/instruction";


const ALLOWED_ORIGIN = '*';

export async function POST(req: Request) {
    try {
        const requestBody = await req.json();

        const {model, messages} = requestBody;

        const client = client_api();


        const completion = await client.chat.completions.create({
            model,
            messages: [
                {role: "system", content: instruction},
                ...messages,
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        let parsed;

        if (!content) {
            return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
        } else {
            try {
                parsed = JSON.parse(content);
            } catch(e) {
                console.error("Failed to parse AI response:", content);
                return NextResponse.json(
                    { error: "Invalid JSON from AI", raw: content },
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