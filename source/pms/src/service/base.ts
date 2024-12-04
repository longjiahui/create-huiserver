import { Application, Context } from "@anfo/huiserver"
import { prisma, TransactionType } from "../db"

export class Service {
  constructor(
    public app: Application,
    public ctx: Context,
    public t: TransactionType = prisma
  ) {}
}

export interface UseService<
  S extends Service,
  SNew extends new (...rest: any[]) => S = new (...rest: any[]) => S
> {
  use(ctx: Context, t?: TransactionType): InstanceType<SNew>
}

export function createServiceFactory<
  S extends Service,
  SNew extends new (...rest: any[]) => S
>(app: Application, ServiceType: SNew): UseService<S, SNew> {
  return {
    use(ctx, t) {
      return new ServiceType(app, ctx, t) as any
    },
  }
}
