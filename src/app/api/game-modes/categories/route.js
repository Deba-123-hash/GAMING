import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listGameModes } from '@/services/contentService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const requestId = createRequestId();
  try {
    const { items } = await listGameModes();
    const categories = Array.from(new Set(items.map((m) => m.category)));
    return successResponse({
      message: 'Game mode categories retrieved.',
      meta: { requestId, count: categories.length },
      data: { categories },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/game-modes/categories' });
  }
}

