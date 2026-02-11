import {NextResponse} from "next/server";
import {client_api} from "@/app/api/_lib/api";

export async function POST(req: Request) {
    try {
        const { userData } = await req.json();

        console.log("userData",userData);
        const completion = await client_api.chat.completions.create(userData);

        console.log("completion", completion);

        if (!completion) {
            return NextResponse.json({ error: "Ошибка, попробуй позже" }, { status: 500 });
        } else {
            return NextResponse.json({
                completion
            })
        }

    } catch(error) {
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}