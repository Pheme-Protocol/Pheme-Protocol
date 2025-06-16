import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '../../../lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

// Log environment variables for debugging
console.log('DATABASE_URL:', process.env.DATABASE_URL)

// Validation schema for waitlist submission
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
})

export async function POST(request: Request) {
  try {
    console.log('Received waitlist submission request')
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate request body
    const validatedData = waitlistSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    try {
      // Check if email or wallet is already registered
      console.log('Checking for existing entries...')
      const existingEntry = await prisma.waitlist.findFirst({
        where: {
          OR: [
            { email: validatedData.email },
            { walletAddress: validatedData.walletAddress }
          ]
        }
      })

      if (existingEntry) {
        console.log('Found existing entry:', existingEntry)
        return NextResponse.json(
          { error: 'Email or wallet address already registered' },
          { status: 400 }
        )
      }

      // Create new waitlist entry
      console.log('Creating new waitlist entry...')
      const entry = await prisma.waitlist.create({
        data: {
          email: validatedData.email,
          walletAddress: validatedData.walletAddress,
          joinedAt: new Date(),
        }
      })
      console.log('Created entry:', entry)

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
    } catch (dbError: unknown) {
      console.error('Database error details:', {
        name: dbError instanceof Error ? dbError.name : 'unknown',
        message: dbError instanceof Error ? dbError.message : 'unknown error',
        code: dbError instanceof PrismaClientKnownRequestError ? dbError.code : 'unknown',
        stack: dbError instanceof Error ? dbError.stack : undefined
      })
      // Log the full error object
      console.error('Full DB Error:', dbError)

      if (dbError instanceof PrismaClientKnownRequestError) {
        // Handle unique constraint violations
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: 'Email or wallet address already registered' },
            { status: 400 }
          )
        }
      }
      
      return NextResponse.json(
        { error: 'Database error occurred', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error('Waitlist submission error details:', {
      name: error instanceof Error ? error.name : 'unknown',
      message: error instanceof Error ? error.message : 'unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    // Log the full error object
    console.error('Full Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 