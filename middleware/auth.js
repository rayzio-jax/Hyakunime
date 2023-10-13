import httpClient from "~/api/api";
export default async ({ redirect, app }) => {
    const token = app.$cookies.get('auth.token')


    if (!token) {
        return redirect('/login')
    }

    const res = await httpClient('/auth/v1/user', 'GET', null, token)
    const data = await res.json()

    if (!data) {
        return redirect('/login')
    }

    app.$cookies.set('user.id', data.id)
}