/** Simula a latência de uma chamada ao backend. */
export const simulateRequest = () => new Promise(resolve => setTimeout(resolve, 600))
