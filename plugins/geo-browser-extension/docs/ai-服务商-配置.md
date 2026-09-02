# AI Provider Configuration Guide

## OpenAI Configuration

### Using Official OpenAI API

```env
OPENAI_API_KEY=sk-proj-xxxxx
# OPENAI_BASE_URL is optional, defaults to https://api.openai.com/v1
```

### Using OpenAI Compatible Proxy

```env
OPENAI_API_KEY=your-proxy-api-key
OPENAI_BASE_URL=https://your-openai-proxy.com/v1
```

### Popular OpenAI Compatible Services

**Azure OpenAI**
```env
OPENAI_API_KEY=your-azure-key
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
```

**国内代理示例 (Generic Proxy)**
```env
OPENAI_API_KEY=sk-xxxxx
OPENAI_BASE_URL=https://api.openai-proxy.com/v1
```

## Anthropic Configuration

### Using Official Anthropic API

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
# ANTHROPIC_BASE_URL is optional, defaults to https://api.anthropic.com
```

### Using Anthropic Proxy

```env
ANTHROPIC_API_KEY=your-proxy-api-key
ANTHROPIC_BASE_URL=https://your-anthropic-proxy.com/v1
```

## Configuration Priority

The AI SDK will use the configuration in the following order:

1. **Custom baseURL** (if provided) - highest priority
2. **Custom apiKey** (if provided)
3. **Provider defaults** (official API endpoints)

## Testing Your Configuration

After setting up your environment variables, restart your development server:

```bash
# Stop the server (Ctrl+C)
pnpm dev
```

Then test by creating a new chat and sending a message. Check the browser console and server logs for any errors.

## Troubleshooting

### OpenAI Errors

**401 Unauthorized**
- Check if your `OPENAI_API_KEY` is correct
- Verify the key has not expired
- Ensure your account has sufficient credits

**404 Not Found**
- Verify your `OPENAI_BASE_URL` is correct
- Check if the model name is supported by your endpoint

### Anthropic Errors

**401 Unauthorized**
- Check if your `ANTHROPIC_API_KEY` is correct
- Verify the API key format starts with `sk-ant-`

**403 Forbidden**
- Your API key may not have access to the requested model
- Check your Anthropic account tier

### Network Errors

**ECONNREFUSED / Timeout**
- Check if your proxy URL is accessible
- Test the endpoint with curl: `curl -I https://your-proxy.com/v1`
- Verify firewall settings if using corporate proxy

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different keys** for development and production
3. **Rotate keys regularly** especially if exposed
4. **Monitor API usage** to detect unauthorized access
5. **Use environment-specific configurations** in production deployments

## Production Deployment

When deploying to production (Vercel, Cloudflare, etc.):

1. Set environment variables in your hosting platform's dashboard
2. Do NOT use `.env` files in production
3. Enable proper CORS and rate limiting
4. Monitor API costs and usage

### Vercel Example

```bash
# Set environment variables in Vercel
vercel env add OPENAI_API_KEY
vercel env add OPENAI_BASE_URL
vercel env add ANTHROPIC_API_KEY
vercel env add ANTHROPIC_BASE_URL
```

### Docker Example

```dockerfile
# In your Dockerfile or docker-compose.yml
ENV OPENAI_API_KEY=sk-xxxxx
ENV OPENAI_BASE_URL=https://api.openai.com/v1
ENV ANTHROPIC_API_KEY=sk-ant-xxxxx
ENV ANTHROPIC_BASE_URL=https://api.anthropic.com
```

## Example .env File

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_BASE_URL=https://api.openai.com/v1

# Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_BASE_URL=https://api.anthropic.com

# Other configurations...
NUXT_SESSION_PASSWORD=your-32-character-session-password
```

## Notes

- The `OPENAI_BASE_URL` and `ANTHROPIC_BASE_URL` are **optional**
- If not provided, the default official endpoints will be used
- All API keys are kept server-side and never exposed to the client
- Configuration is loaded via Nuxt's `runtimeConfig`
