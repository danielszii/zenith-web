import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);
const maxFileSize = 4 * 1024 * 1024;

export class MediaService {
  private bucketReady = false;

  async upload(input: { data?: unknown; mimeType?: unknown; kind?: unknown }) {
    const mimeType = String(input.mimeType || '').toLowerCase();
    const extension = allowedTypes.get(mimeType);
    if (!extension) throw new AppError('Use uma imagem JPG, PNG ou WebP.', 400);
    if (input.kind !== 'atleta' && input.kind !== 'clube') {
      throw new AppError('Destino de imagem inválido.', 400);
    }
    if (typeof input.data !== 'string') throw new AppError('Imagem não enviada.', 400);

    const base64 = input.data.replace(/^data:[^;]+;base64,/, '');
    const file = Buffer.from(base64, 'base64');
    if (!file.length) throw new AppError('O arquivo de imagem está vazio.', 400);
    if (file.length > maxFileSize) throw new AppError('A imagem deve ter no máximo 4 MB.', 413);
    this.assertConfigured();
    await this.ensureBucket();

    const objectPath = `${input.kind}/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
    const response = await fetch(
      `${env.supabaseUrl}/storage/v1/object/${env.supabaseStorageBucket}/${objectPath}`,
      {
        method: 'POST',
        headers: {
          apikey: env.supabaseSecretKey!,
          Authorization: `Bearer ${env.supabaseSecretKey}`,
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'x-upsert': 'false',
        },
        body: file,
      },
    );
    if (!response.ok) {
      console.error('Supabase Storage upload:', response.status, await response.text());
      throw new AppError('Não foi possível armazenar a imagem.', 502);
    }

    return {
      url: `${env.supabaseUrl}/storage/v1/object/public/${env.supabaseStorageBucket}/${objectPath}`,
      path: objectPath,
    };
  }

  private assertConfigured() {
    if (!env.supabaseUrl || !env.supabaseSecretKey) {
      throw new AppError('O armazenamento de imagens ainda não foi configurado no servidor.', 503);
    }
  }

  private async ensureBucket() {
    if (this.bucketReady) return;
    const headers = {
      apikey: env.supabaseSecretKey!,
      Authorization: `Bearer ${env.supabaseSecretKey}`,
    };
    const check = await fetch(
      `${env.supabaseUrl}/storage/v1/bucket/${env.supabaseStorageBucket}`,
      { headers },
    );
    const checkError = check.ok ? '' : await check.text();
    let bucketMissing = check.status === 404;
    if (checkError) {
      try {
        const parsed = JSON.parse(checkError) as { code?: string; statusCode?: string | number };
        bucketMissing ||= parsed.code === 'NoSuchBucket' || Number(parsed.statusCode) === 404;
      } catch {
        // A resposta textual será registrada abaixo caso seja um erro inesperado.
      }
    }
    if (bucketMissing) {
      const create = await fetch(`${env.supabaseUrl}/storage/v1/bucket`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: env.supabaseStorageBucket,
          name: env.supabaseStorageBucket,
          public: true,
          file_size_limit: maxFileSize,
          allowed_mime_types: [...allowedTypes.keys()],
        }),
      });
      if (!create.ok && create.status !== 409) {
        console.error('Supabase Storage bucket:', create.status, await create.text());
        throw new AppError('Não foi possível preparar o armazenamento de imagens.', 502);
      }
    } else if (!check.ok) {
      console.error('Supabase Storage bucket check:', check.status, checkError);
      throw new AppError('Não foi possível acessar o armazenamento de imagens.', 502);
    }
    this.bucketReady = true;
  }
}
