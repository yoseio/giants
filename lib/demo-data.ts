export type Paper = {
  id: string
  title: string
  authors: string
  abstract: string
}

export const papers: Paper[] = [
  {
    id: '1',
    title: 'A Study on React Components',
    authors: 'Jane Doe, John Smith',
    abstract: 'An exploration of React component patterns and best practices.'
  },
  {
    id: '2',
    title: 'Next.js for Beginners',
    authors: 'Alice Example',
    abstract: 'Introduction to building web applications using Next.js.'
  },
  {
    id: '3',
    title: 'Advances in TypeScript',
    authors: 'Bob Developer',
    abstract: 'Recent features and improvements in the TypeScript language.'
  },
]

export function searchPapers(query: string): Paper[] {
  const q = query.toLowerCase()
  return papers.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q)
  )
}

export function getPaper(id: string): Paper | undefined {
  return papers.find((p) => p.id === id)
}
