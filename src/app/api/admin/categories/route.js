import { assertPermission } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { createCategory, listCategories } from '@/server/services/adminService';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';
import { parseJsonBody, validateWithSchema } from '@/server/utils/validation';
import { categoryMutationSchema } from '@/server/validation/domainSchemas';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    assertPermission(session, 'analytics.read');
    const categories = listCategories();

    return successResponse({
      message: 'Categories loaded.',
      meta: { requestId, count: categories.length },
      data: { categories },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/categories' });
  }
}

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const actor = assertPermission(session, 'categories.manage');
    const body = await parseJsonBody(request);
    const input = validateWithSchema(categoryMutationSchema, body);
    const category = createCategory(input, actor, requestId);

    return successResponse({
      status: 201,
      message: 'Category created.',
      meta: { requestId },
      data: { category },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/admin/categories' });
  }
}
