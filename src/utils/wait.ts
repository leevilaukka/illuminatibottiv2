/**
 * Async wait function
 * @param ms Milliseconds to wait
 * @returns Promise
 * @example
 * await wait(1000);
 */
function wait(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

export default wait;