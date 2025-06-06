import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { VerificationCreated } from '../generated/PhemeProtocol/PhemeProtocol'
import { User, Verification } from '../generated/schema'

export function handleVerificationCreated(event: VerificationCreated): void {
  let userId = event.params.user.toHexString()
  let user = User.load(userId)
  
  if (user == null) {
    user = new User(userId)
    user.address = event.params.user
    user.createdAt = event.block.timestamp
    user.updatedAt = event.block.timestamp
    user.save()
  }

  let verificationId = event.transaction.hash.toHexString() + '-' + event.logIndex.toString()
  let verification = new Verification(verificationId)
  verification.user = user.id
  verification.content = event.params.skillId
  verification.timestamp = event.params.timestamp
  verification.createdAt = event.block.timestamp
  verification.updatedAt = event.block.timestamp
  verification.save()
} 