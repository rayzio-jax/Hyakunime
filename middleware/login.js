import httpClient from "~/api/api"
export default async ({ redirect, app }) => {
    const token = app.$cookies.get('auth.token')

    if (token) {
        const res = await httpClient('/auth/v1/user', 'GET', null, token)
        const data = await res.json()

        if (data) {
            return redirect('/')
        }

        app.$cookies.remove('auth.token')
    }
}