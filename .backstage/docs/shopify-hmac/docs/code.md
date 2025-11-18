# Code Snippets

## Complete Shopify Hmac Guard Implementation

Copy this into `guards/shopify-proxy.guard.ts`:
```typescript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'

@Injectable()
export class ShopifyHmacGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()
		const { signature, ...queryParams } = request.query

		if (!signature || typeof signature !== 'string') {
			throw new UnauthorizedException('Missing signature')
		}

		// Rimuovi chiavi non necessarie
		delete queryParams['hmac']

		// Genera la stringa ordinata in modo deterministico
		const sortedParams = Object.keys(queryParams)
			.sort()
			.map((key) => {
				const value = queryParams[key]
				if (Array.isArray(value)) {
					return `${key}=${value.join(',')}`
				}
				return `${key}=${value}`
			})
			.join('')

		// Calcola HMAC SHA256 in HEX (Shopify usa hexdigest per la signature)
		const secret = this.configService.get('shopify.proxyApiSecret')
		const calculatedSignature = crypto.createHmac('sha256', secret).update(sortedParams).digest('hex')

		// Confronto sicuro
		const sigBuf = Buffer.from(signature, 'utf-8')
		const calcBuf = Buffer.from(calculatedSignature, 'utf-8')

		if (sigBuf.length !== calcBuf.length || !crypto.timingSafeEqual(sigBuf, calcBuf)) {
			throw new UnauthorizedException('Invalid signature')
		}

		// Riscrivi URL: rimuovi /proxy dal path, la request sarà gestita come /...
		request.url = request.url.replace(/^\/proxy/, '') || '/'

		return true
	}
}

```
