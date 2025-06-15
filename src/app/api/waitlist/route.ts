import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// Validation schema for waitlist submission
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = waitlistSchema.parse(body)
    
    // Check if email or wallet is already registered
    const existingEntry = await prisma.waitlist.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { walletAddress: validatedData.walletAddress }
        ]
      }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email or wallet address already registered' },
        { status: 400 }
      )
    }

    // Create new waitlist entry
    const entry = await prisma.waitlist.create({
      data: {
        email: validatedData.email,
        walletAddress: validatedData.walletAddress,
        joinedAt: new Date(),
      }
    })

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist',
        data: {
          id: entry.id,
          email: entry.email,
          walletAddress: entry.walletAddress,
          joinedAt: entry.joinedAt
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Waitlist submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 