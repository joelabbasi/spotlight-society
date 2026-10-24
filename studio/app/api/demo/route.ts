import { submitDemo } from '../../../lib/demo-request.mjs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) { return submitDemo(request); }
