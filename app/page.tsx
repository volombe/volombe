import { readFile } from 'fs/promises'
import path from 'path'

export default async function HomePage() {
  const filePath = path.join(process.cwd(), 'public', 'index.html')
  const html = await readFile(filePath, 'utf-8')

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
