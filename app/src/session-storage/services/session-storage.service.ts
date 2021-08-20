import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SessionEntity, SessionDocument } from '../entities/session.entity'
import { Session } from '../types'

@Injectable()
export class SessionStorageService {
  constructor(
    @InjectModel(SessionEntity.name)
    private sessionModel: Model<SessionDocument>
  ) {}

  public async update<T extends Record<string, any | null>>(
    id: string,
    data: T
  ): Promise<Session<T>> {
    const doc = await this.sessionModel.findOne({ code: id }).exec()
    if (!doc) throw new NotFoundException(`Session with id=${id} not found`)
    doc.data = { ...doc.data, ...data }
    await doc.save({ validateBeforeSave: false })

    return this.convertSession(doc)
  }

  public async create<T extends Record<string, any>>(
    session: Session<T>
  ): Promise<Session<T>> {
    const id = session.id
    const data: Record<string, unknown> = session

    delete data.id

    const doc = new this.sessionModel({ code: id, data })

    await doc.save({ validateBeforeSave: false })
    return this.convertSession(doc)
  }

  public async get<T extends Record<string, any>>(
    id: string
  ): Promise<Session<T> | undefined> {
    const doc = await this.sessionModel.findOne({ code: id }).exec()
    if (doc) {
      return this.convertSession(doc)
    }
  }

  public async clear() {
    // Are you MAD?
    await this.sessionModel.deleteMany({})
  }

  private convertSession<T>(doc: SessionDocument): Session<T> {
    return { ...doc.data, id: doc.code } as Session<T>
  }
}
