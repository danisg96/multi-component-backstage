# Shopify Proxy HMAC Guard

## Overview

NestJS guard to intercept and validate incoming requests from Shopify App Proxy. This guard ensures that all requests coming through Shopify's App Proxy are legitimate by validating the HMAC signature.

## Features & Benefits

### ✅ **Pros**
- **Security**: Validates HMAC signature to ensure requests are genuinely from Shopify
- **Easy Integration**: Simple drop-in guard for NestJS applications
- **Flexible**: Can be applied at controller, method, or global level
- **Type-Safe**: Full TypeScript support with proper typing
- **Production Ready**: Battle-tested implementation
- **Lightweight**: Minimal dependencies and overhead

## Requirements

### Prerequisites
- NestJS 8.0 or higher
- Node.js 14 or higher

### Configuration Required
- **Shopify API Secret**: Your app's API secret key from Shopify Partner Dashboard
  - Found in: Apps → Your App → App Setup → API credentials
  - Environment variable: `SHOPIFY_API_SECRET`

### Dependencies
```json
{
  "@nestjs/common": "^8.0.0",
  "@nestjs/core": "^8.0.0",
  "crypto": "built-in"
}
```

## Security Note

⚠️ **Important**: Never commit your API secret to version control. Always use environment variables or secure secret management systems.
