import fs from 'fs/promises'
import path from 'path'

export type Author = {
  authorId: string
  name: string
}

export type Paper = {
  paperId: string
  title: string
  year?: number
  abstract: string | null
  authors: Author[]
  openAccessPdf?: { url: string }
}

export async function getPaper(id: string): Promise<Paper | null> {
  try {
    const filePath = path.join(process.cwd(), 'papers', `${id}.json`)
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data) as Paper
  } catch {
    return null
  }
}
