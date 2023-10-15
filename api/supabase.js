import { createClient } from '@supabase/supabase-js'

export const supabase = ({ token = null, key = null }) => {
    const supabaseUrl = process.env.SUPABASE_URL
    const options = {
        db: {
            schema: 'public',
        },
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        global: {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Prefer": "return=representation"
            },
        },
    }

    if (key === 'admin') {
        const supabaseKey = process.env.SUPABASE_ADMIN_KEY
        const supabase = createClient(supabaseUrl, supabaseKey, options)
        return supabase
    }

    const supabaseKey = process.env.SUPABASE_CLIENT_KEY
    const supabase = createClient(supabaseUrl, supabaseKey, options)
    return supabase
}