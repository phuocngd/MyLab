const swapArrayElements = (arr: [], indexA: number, indexB: number): void => {
    let temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
};
const CARD_POINT_VALUE = [
    { card: "A", point: 1 },
    { card: "2", point: 2 },
    { card: "3", point: 3 },
    { card: "4", point: 4 },
    { card: "5", point: 5 },
    { card: "6", point: 6 },
    { card: "7", point: 7 },
    { card: "8", point: 8 },
    { card: "9", point: 9 },
    { card: "10", point: 10 },
    { card: "J", point: 11 },
    { card: "Q", point: 12 },
    { card: "K", point: 13 },
]

export {
    swapArrayElements,
    CARD_POINT_VALUE
}