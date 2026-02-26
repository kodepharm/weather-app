import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const text = await file.text()

    // Save to data/school-closings.csv in repo root
    const cwd = process.cwd()
    const dataDir = join(cwd, 'data')
    mkdirSync(dataDir, { recursive: true })
    writeFileSync(join(dataDir, 'school-closings.csv'), text, 'utf8')

    // Git commit
    try {
      execSync('git add data/school-closings.csv', { cwd })
      execSync('git -c user.email="kiosk@local" -c user.name="Kiosk" commit -m "Update school closings data"', { cwd })
    } catch {
      // Nothing to commit (file unchanged) — not an error
    }

    // Git push — use GIT_PUSH_TOKEN if available
    const token = process.env.GIT_PUSH_TOKEN
    const pushCmd = token
      ? `git push https://${token}@github.com/kodepharm/weather-app.git HEAD:main`
      : 'git push'

    try {
      execSync(pushCmd, { cwd })
      return NextResponse.json({ success: true, pushed: true })
    } catch (pushErr) {
      return NextResponse.json({ success: true, pushed: false, pushError: String(pushErr) })
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
