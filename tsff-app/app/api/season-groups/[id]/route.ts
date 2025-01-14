import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    console.log("Fetching season groups");
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId');

    if (!seasonId) {
        return NextResponse.json({ error: 'Invalid season_id' }, { status: 400 });
    }

    console.log("Season ID:", seasonId);

    try {
        const { data, error } = await supabase
            .from('season_groups')
            .select('*')
            .eq('season_id', seasonId);

        if (error) {
            throw error;
        }

        return data.length > 0
            ? NextResponse.json(data, { status: 200 })
            : NextResponse.json({ error: 'No season groups found' }, { status: 404 });
    } catch (error: any) {
        console.error('Error fetching season groups:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
