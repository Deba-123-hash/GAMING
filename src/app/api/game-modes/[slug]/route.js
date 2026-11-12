import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { listGameModes } from '@/services/contentService';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  const requestId = createRequestId();
  try {
    const { slug } = await context.params;
    const { items } = await listGameModes();
    const gameMode = items.find((m) => m.slug === slug || m.id === slug);
    if (!gameMode) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Game mode not found.',
      });
    }
    return successResponse({
      message: 'Game mode loaded.',
      meta: { requestId },
      data: { gameMode },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/game-modes/[slug]' });
  }
}

