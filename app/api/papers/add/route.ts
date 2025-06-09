import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const doi = formData.get('doi')
  const file = formData.get('pdf')

  if (!doi || typeof doi !== 'string' || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const hash = createHash('sha256').update(doi).digest('hex')
  const branch = `add-paper-${hash}`
  const path = `papers/${hash}.pdf`

  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'giants-app',
    Accept: 'application/vnd.github+json'
  }

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
  if (!repoRes.ok) {
    const text = await repoRes.text()
    return NextResponse.json({ error: 'Failed to get repo', details: text }, { status: 500 })
  }
  const repoData = await repoRes.json()
  const defaultBranch = repoData.default_branch

  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`, { headers })
  if (!refRes.ok) {
    const text = await refRes.text()
    return NextResponse.json({ error: 'Failed to get branch ref', details: text }, { status: 500 })
  }
  const refData = await refRes.json()
  const baseSha = refData.object.sha

  const createBranchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha })
  })
  if (!createBranchRes.ok) {
    const text = await createBranchRes.text()
    return NextResponse.json({ error: 'Failed to create branch', details: text }, { status: 500 })
  }

  const buffer = Buffer.from(await (file as Blob).arrayBuffer())
  const content = buffer.toString('base64')

  const createFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Add paper ${doi}`, content, branch })
  })
  if (!createFileRes.ok) {
    const text = await createFileRes.text()
    return NextResponse.json({ error: 'Failed to create file', details: text }, { status: 500 })
  }

  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: `Add paper ${doi}`,
      head: branch,
      base: defaultBranch,
      body: 'Automated paper upload'
    })
  })
  if (!prRes.ok) {
    const text = await prRes.text()
    return NextResponse.json({ error: 'Failed to create pull request', details: text }, { status: 500 })
  }
  const prData = await prRes.json()

  return NextResponse.json({ url: prData.html_url })
}
