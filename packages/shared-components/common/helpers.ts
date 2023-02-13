export const scale = (n: number, isMinor?: boolean) => {
    const prime = isMinor ? 4 : 8;
    return n * prime;
};

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
