import { Injectable, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class ResponsaRequestInputReader {
  constructor(private readonly input: string | number) {}

  public asString(): string | undefined {
    return typeof this.input === 'string' ? this.input : undefined
  }

  public asNumber(): number | undefined {
    return typeof this.input === 'number' ? this.input : undefined
  }
}
