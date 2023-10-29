const colors = [
    'orange',
    'blue',
    'red',
    'indigo',
    'cyan',
    'teal'
    // 'black',
    // 'violet',
    // 'yellow',
]

// simple hash function
// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
export const findColor = (str: string) => {
    let hash = 0

    for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }

    return colors[Math.abs(hash) % colors.length]
}
