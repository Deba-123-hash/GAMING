import { assertAuthenticated } from '@/server/auth/rbac';
import { getServerSession } from '@/server/auth/sessionService';
import { getDevStore } from '@/server/database/devMemoryStore';
import { recordAuditEvent } from '@/server/services/auditService';
import {
  getPrivateProfile,
  removeProfileAvatar,
  validateAndPrepareAvatar,
} from '@/server/services/profileService';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { createRequestId, successResponse } from '@/server/utils/apiResponse';
import { handleApiError } from '@/server/utils/errorHandler';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);

    let mimeType = '';
    let byteLength = 0;
    let originalName = 'avatar.webp';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('avatar') || formData.get('file');
      if (!file || typeof file === 'string') {
        throw new ApiError({
          statusCode: 400,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Avatar file field is required.',
        });
      }
      mimeType = file.type;
      byteLength = file.size;
      originalName = file.name || 'avatar.webp';
    } else {
      const payload = await request.json().catch(() => null);
      if (!payload || typeof payload !== 'object') {
        throw new ApiError({
          statusCode: 400,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Provide multipart/form-data or valid JSON avatar metadata.',
        });
      }
      mimeType = String(payload.mimeType || '');
      byteLength = Number(payload.byteLength || 0);
      originalName = String(payload.originalName || 'avatar.webp');
    }

    const prepared = validateAndPrepareAvatar({ mimeType, byteLength, originalName });
    const store = getDevStore();
    const profile = store.profiles.find((p) => p.userId === user.id);
    if (!profile) {
      throw new ApiError({
        statusCode: 404,
        code: ERROR_CODES.NOT_FOUND,
        message: 'Profile not found.',
      });
    }

    // Stored key represents the validated upload slot; live bucket sync activates in Phase 19/20.
    profile.avatarUrl = `/uploads/${prepared.storageKey}`;
    profile.updatedAt = new Date().toISOString();

    recordAuditEvent({
      actorUserId: user.id,
      actorRole: user.role,
      action: 'profile.avatar_update',
      targetType: 'profile',
      targetId: profile.id,
      metadata: { storageKey: prepared.storageKey },
      requestId,
    });

    return successResponse({
      message: 'Avatar validated and linked to profile.',
      meta: { requestId },
      data: {
        profile: getPrivateProfile(user.id),
        storageKey: prepared.storageKey,
        persistedToCloudStorage: false,
      },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/avatar' });
  }
}

export async function DELETE(request) {
  const requestId = createRequestId();
  try {
    const session = await getServerSession(request);
    const user = assertAuthenticated(session);
    const profile = removeProfileAvatar(user.id);
    recordAuditEvent({
      actorUserId: user.id,
      actorRole: user.role,
      action: 'profile.avatar_remove',
      targetType: 'profile',
      targetId: profile.id,
      requestId,
    });
    return successResponse({
      message: 'Avatar removed from profile.',
      meta: { requestId },
      data: { profile },
    });
  } catch (error) {
    return handleApiError(error, { requestId, endpoint: '/api/profile/avatar' });
  }
}
