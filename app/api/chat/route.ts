import {NextResponse} from "next/server";
import {client_api} from "@/app/api/_lib/api";

export async function POST(req: Request) {
    try {
        const requestBody = await req.json();
        const {model, messages} = requestBody;

        const completion = await client_api.chat.completions.create({
            model,
            messages,
        });
        console.log(completion.choices[0].message);


        return NextResponse.json({
            completion
        })} catch(error) {
        console.log(error);

        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}