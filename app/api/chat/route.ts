import {NextResponse} from "next/server";
import {client_api} from "@/app/api/_lib/api";


const ALLOWED_ORIGIN = 'http://localhost:3000';

export async function POST(req: Request) {
    try {
        const requestBody = await req.json();

        const {model, messages} = requestBody;

        const client = client_api();

        const completion = await client.chat.completions.create({
            model,
            messages,
        });
        console.log(completion.choices[0].message);


        return NextResponse.json({
            completion
        }, { headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true', },});
    } catch(error) {
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