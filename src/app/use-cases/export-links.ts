import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'
import { stringify } from 'csv-stringify'

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<Either<never, ExportLinksOutput>> {
  const { sql } = db
    .select({
      id: schema.links.id,
      originalURL: schema.links.originalURL,
      shortURL: schema.links.shortURL,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .toSQL()

  const cursor = pg.unsafe(sql).cursor(5)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_URL', header: 'Original URL' },
      { key: 'short_URL', header: 'Short URL' },
      { key: 'accessCount', header: 'Access Count' },
      { key: 'created_at', header: 'Created at' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }
        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}
