const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { defineSecret, defineString } = require('firebase-functions/params');
const { HttpsError, onCall } = require('firebase-functions/v2/https');

if (getApps().length === 0) initializeApp();

const db = getFirestore();
const metaPageAccessToken = defineSecret('META_PAGE_ACCESS_TOKEN');
const metaPageId = defineString('META_PAGE_ID');
const metaInstagramAccountId = defineString('META_INSTAGRAM_ACCOUNT_ID');
const metaGraphApiVersion = defineString('META_GRAPH_API_VERSION');
const supportedChannels = new Set(['facebook', 'instagram']);

const assertAuthorizedMarketingUser = async (request) => {
  const uid = request.auth?.uid;
  if (!uid || request.auth.token.email_verified !== true) {
    throw new HttpsError('unauthenticated', 'Inicie sessão com um email confirmado.');
  }

  const adminSnapshot = await db.collection('admins').doc(uid).get();
  const profile = adminSnapshot.data();
  if (!profile || profile.active !== true || profile.mustChangePassword === true || !['Super Admin', 'Admin', 'Marketing'].includes(profile.role)) {
    throw new HttpsError('permission-denied', 'A conta não tem permissão para publicar campanhas.');
  }
};

const graphPost = async (endpoint, values) => {
  const accessToken = metaPageAccessToken.value();
  const body = new URLSearchParams({ ...values, access_token: accessToken });
  const response = await fetch(`https://graph.facebook.com/${metaGraphApiVersion.value()}/${endpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.error) {
    const message = String(result.error?.message || 'A API Meta rejeitou a publicação.')
      .replaceAll(accessToken, '[redacted]')
      .slice(0, 400);
    throw new Error(message);
  }
  return result;
};

const validateImageUrl = (value) => {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new HttpsError('invalid-argument', 'A campanha precisa de uma imagem pública válida para o Instagram.');
  }
  const hostname = url.hostname.toLowerCase();
  const isPrivateHost = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)
    || hostname === '[::1]'
    || hostname.endsWith('.local');
  if (url.protocol !== 'https:' || isPrivateHost) {
    throw new HttpsError('invalid-argument', 'A imagem deve usar um endereço HTTPS público.');
  }
  return url.toString();
};

const publishToFacebook = async (campaign) => {
  const endpoint = campaign.mediaUrl ? `${metaPageId.value()}/photos` : `${metaPageId.value()}/feed`;
  const values = campaign.mediaUrl
    ? { url: campaign.mediaUrl, caption: campaign.copy }
    : { message: campaign.copy };
  const result = await graphPost(endpoint, values);
  return { channel: 'facebook', status: 'published', postId: String(result.id || result.post_id || '') };
};

const publishToInstagram = async (campaign) => {
  const container = await graphPost(`${metaInstagramAccountId.value()}/media`, {
    image_url: campaign.mediaUrl,
    caption: campaign.copy,
  });
  const result = await graphPost(`${metaInstagramAccountId.value()}/media_publish`, {
    creation_id: String(container.id),
  });
  return { channel: 'instagram', status: 'published', postId: String(result.id || '') };
};

exports.publishMetaCampaign = onCall({
  timeoutSeconds: 120,
  memory: '256MiB',
  secrets: [metaPageAccessToken],
}, async (request) => {
  await assertAuthorizedMarketingUser(request);
  const campaignId = String(request.data?.campaignId || '');
  if (!/^[A-Za-z0-9_-]{1,150}$/.test(campaignId)) {
    throw new HttpsError('invalid-argument', 'Identificador de campanha inválido.');
  }

  const campaignRef = db.collection('marketingPosts').doc(campaignId);
  let campaign;
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(campaignRef);
    if (!snapshot.exists || snapshot.data().status !== 'draft') {
      throw new HttpsError('failed-precondition', 'Só é possível publicar uma campanha em rascunho.');
    }
    campaign = snapshot.data();
    if (!campaign.title?.trim() || !campaign.copy?.trim() || !Array.isArray(campaign.channels) || campaign.channels.length === 0) {
      throw new HttpsError('failed-precondition', 'Complete o texto e escolha pelo menos uma rede.');
    }
    if (campaign.channels.some((channel) => !supportedChannels.has(channel))) {
      throw new HttpsError('failed-precondition', 'A campanha contém uma rede ainda não integrada.');
    }
    if (new Set(campaign.channels).size !== campaign.channels.length || campaign.channels.length > supportedChannels.size) {
      throw new HttpsError('failed-precondition', 'A campanha contém redes repetidas.');
    }
    transaction.update(campaignRef, { status: 'publishing', updatedAt: new Date().toISOString() });
  });

  if (campaign.channels.includes('instagram') && !campaign.mediaUrl) {
    await campaignRef.update({ status: 'draft', updatedAt: new Date().toISOString() });
    throw new HttpsError('failed-precondition', 'O Instagram exige uma imagem pública HTTPS.');
  }
  if (campaign.mediaUrl) {
    try {
      campaign.mediaUrl = validateImageUrl(campaign.mediaUrl);
    } catch (error) {
      await campaignRef.update({ status: 'draft', updatedAt: new Date().toISOString() });
      throw error;
    }
  }

  const results = [];
  for (const channel of campaign.channels) {
    try {
      results.push(channel === 'facebook'
        ? await publishToFacebook(campaign)
        : await publishToInstagram(campaign));
    } catch (error) {
      results.push({ channel, status: 'failed', error: String(error?.message || 'Falha na publicação.').slice(0, 400) });
    }
  }

  const publishedCount = results.filter((result) => result.status === 'published').length;
  const status = publishedCount === results.length ? 'published' : publishedCount > 0 ? 'partial' : 'failed';
  const publishedAt = publishedCount ? new Date().toISOString() : null;
  await campaignRef.update({ status, publishResults: results, publishedAt, updatedAt: new Date().toISOString() });

  return { campaignId, status, results, publishedAt };
});
