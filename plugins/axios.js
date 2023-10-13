// plugins/axios.js
export default function ({ $axios }) {
    // Interceptor to handle API rate limiting
    $axios.onResponse(response => {
        const rateLimitRemaining = parseInt(response.headers['x-ratelimit-requests-remaining']);
        console.log('Request remaining: ', rateLimitRemaining);
        if (isNaN(rateLimitRemaining) || rateLimitRemaining === 0) {
            // API limit exceeded, stop making requests and show an error message
            return Promise.reject(new Error(response.message));
        }
        return response;
    });
}
