import type { IncomingMessage, ServerResponse } from "node:http";
export const OWNER_ID: string;
export function initializeLocal(directory: string, password: string): Promise<void>;
export function createLocalBackend(options?: {
  directory?: string;
}): Promise<
  (request: IncomingMessage, response: ServerResponse, next: () => void) => Promise<void>
>;
