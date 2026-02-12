import client_api from "@/app/api/_lib/api";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const { userData, aiRequestBody } = await req.json();

        console.log("aiRequestBody", aiRequestBody);

        const completion = await client_api.chat.completions.create(aiRequestBody);


        let parsed;

        if (!completion) {
            return NextResponse.json({ error: "Ошибка, попробуй позже" }, { status: 500 });
        } else {
            try {
                parsed = completion;
            } catch(e) {
                console.error("Failed to parse AI response:", completion);
                return NextResponse.json(
                    { error: "Ошибка, попробуй позже", raw: completion },
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