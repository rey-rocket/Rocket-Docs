# Debugging Webhooks

1. Test with `curl`:
   ```bash
curl -X POST https://yourapp/api/hook \
  -H "Content-Type: application/json" \
  -d '{"event":"test","user":1}'
```
2. Check server logs for incoming payload.
