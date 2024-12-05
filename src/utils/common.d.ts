declare module '@/utils/common' {
    // Add type declarations for the exports of common.ts
    export function useThrottle(callback: Function, delay: number): Function;
    // Add other exports as needed
}