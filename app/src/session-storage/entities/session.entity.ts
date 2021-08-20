import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'

export type SessionDocument = SessionEntity & Document

@Schema()
export class SessionEntity {
  @Prop({ required: true })
  code!: string

  @Prop({ required: true, type: SchemaTypes.Mixed })
  data!: Record<string, unknown>
}

export const SessionSchema = SchemaFactory.createForClass(SessionEntity)
