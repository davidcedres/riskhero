export const makeError = (key: string, msg: string) => {
    return [
        {
            errors: {
                issues: [{ path: [key], message: msg }]
            }
        }
    ]
}
