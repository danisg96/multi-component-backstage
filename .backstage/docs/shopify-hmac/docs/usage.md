# Usage Guide


## Module Registration

Register the guard as a provider in your module:
```typescript
// app.module.ts or feature.module.ts
import { Module } from '@nestjs/common';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard';

@Module({
  providers: [ShopifyHmacGuard],
  // ... other module configuration
})
export class AppModule {}
```

## Integration Methods

### Method 1: Controller Level Usage

Apply to specific controllers or routes:
```typescript
// products.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard';

@Controller('shopify-proxy')
@UseGuards(ShopifyHmacGuard) // Protects all routes in this controller
export class ShopifyProxyController {
  
  @Get('products')
  getProducts() {
    return { products: [] };
  }

  @Get('inventory')
  getInventory() {
    return { inventory: [] };
  }
}
```

### Method 2: Method Level Usage

Apply to specific endpoints only:
```typescript
@Controller('api')
export class ApiController {
  
  @Get('public')
  publicEndpoint() {
    return { message: 'Public data' };
  }

  @UseGuards(ShopifyHmacGuard) // Only this route is protected
  @Get('shopify-proxy')
  shopifyProxyEndpoint() {
    return { message: 'Shopify validated data' };
  }
}
```

### Method 3: Global Usage for Specific Subpath

Configure globally for all routes under a specific path:
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ShopifyHmacGuard } from './guards/shopify-hmac.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply globally to all routes starting with /shopify-proxy
  app.use('/shopify-proxy/*', (req, res, next) => {
    // Guard logic would need to be adapted for middleware use
    next();
  });

  await app.listen(3000);
}
bootstrap();
```

Or use global guard with path filtering:
```typescript
// app.module.ts
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (configService: ConfigService) => {
        return new ShopifyHmacGuard(configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
```

## Environment Configuration

Create a `.env` file:
```env
# Shopify API credentials
SHOPIFY_API_SECRET=your_shopify_api_secret_here
```

Load in your configuration:
```typescript
// config/configuration.ts
export default () => ({
  shopify: {
    apiSecret: process.env.SHOPIFY_API_SECRET,
  },
});
```

## Best Practices

1. **Always use ConfigService**: Never hardcode the API secret
2. **Log attempts**: Consider logging failed authentication attempts
