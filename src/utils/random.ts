export function randomNum(from: number, to: number): number {
    return Math.random() * (to - from) + from;
}

export function randomString(stringArr: string[]): string {
    return stringArr[Math.floor(Math.random() * stringArr.length)];
}