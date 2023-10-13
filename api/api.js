const httpClient = async (endpoint, method, data = null, token = null) => {
    const baseUrl = process.env.SUPABASE_URL

    const headers = {
        apikey: process.env.SUPABASE_CLIENT_KEY,
    }
    if (token) {
        headers.authorization = `Bearer ${token}`
    }
    if (method === "POST" || method === "PATCH") {
        headers.Prefer = "return=representation"
        headers["Content-Type"] = "application/json"
    }

    if (data) {
        return await fetch(baseUrl + endpoint, {
            method,
            headers,
            body: JSON.stringify(data)
        })
    }

    return await fetch(baseUrl + endpoint, {
        method,
        headers
    })
}

export default httpClient