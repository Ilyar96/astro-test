import axios from 'axios';

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

const strapiAPI = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  },
});

export interface DocumentationItem {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function getDocumentation(): Promise<DocumentationItem[]> {
  try {
    console.log('📡 Fetching documentation from:', STRAPI_URL);
    const response = await strapiAPI.get('/api/documentations');
    console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
    
    const data = response.data.data || response.data;
    console.log('✅ Documentation fetched:', Array.isArray(data) ? data.length : 'not array', 'items');
    console.log('✅ Data structure:', JSON.stringify(data, null, 2));
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error fetching documentation:', error);
    return [];
  }
}

export async function getDocumentationBySlug(slug: string): Promise<DocumentationItem | null> {
  try {
    console.log('📡 Fetching documentation with slug:', slug);
    const response = await strapiAPI.get(
      `/api/documentations?filters[slug][$eq]=${slug}`
    );
    console.log('📊 Response for slug:', JSON.stringify(response.data, null, 2));
    
    const data = response.data.data || response.data;
    const doc = Array.isArray(data) ? data[0] : (data && data.title ? data : null);
    
    if (doc) {
      console.log('✅ Document found:', doc.title || 'unknown');
    } else {
      console.log('⚠️ Document not found:', slug);
    }
    return doc || null;
  } catch (error) {
    console.error('❌ Error fetching documentation:', error);
    return null;
  }
}