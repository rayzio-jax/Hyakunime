import { createClient } from '@supabase/supabase-js'

export const supabase = ({ token = null }) => {
    // export const supabase = (token) => {
    const supabaseKey = process.env.SUPABASE_CLIENT_KEY
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

    const supabase = createClient(supabaseUrl, supabaseKey, options)
    return supabase
}