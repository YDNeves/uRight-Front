import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'uright_secret_key_2024'

// Mock user database
const users = [
  { id: 1, email: 'admin@uright.com', password: 'admin123', name: 'Admin URight' },
]

export async function POST(request: NextRequest) {
  const { action, email, password, name } = await request.json()

  if (action === 'login') {
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  }

  if (action === 'register') {
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    const newUser = { id: users.length + 1, email, password, name }
    users.push(newUser)
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' })
    return NextResponse.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
