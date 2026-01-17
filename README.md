# Verifio

<div align="center">

**Open-source email verification infrastructure — transparent, self-hostable, and free to start.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GitHub Stars](https://img.shields.io/github/stars/verifio-email/verifio?style=social)](https://github.com/verifio-email/verifio)
[![Documentation](https://img.shields.io/badge/docs-verifio.email-blue)](https://verifio.email/docs)

*An open-source alternative to ZeroBounce and Emailable*

[Website](https://verifio.email) • [Documentation](https://verifio.email/docs) • [API Reference](https://verifio.email/docs/api) • [Self-Hosting Guide](https://verifio.email/docs/self-hosting)

</div>

---

## Why Verifio?

Most email verification tools are **black boxes**. They tell you an email is "valid" or "risky" — but never explain *why*. You're forced to trust proprietary logic you can't inspect, audit, or control.

**Verifio changes that.**

We believe email verification should be:

- 🔍 **Transparent** — see the exact signals behind every verification result
- 🔓 **Open source** — audit the logic, contribute improvements, own your infrastructure
- 🧩 **Self-hostable** — deploy on your own servers, no vendor lock-in
- ⚡ **Developer-first** — built as infrastructure, not just another SaaS dashboard

---

## Features

✅ **Multi-signal verification** — syntax, DNS, MX records, SMTP handshake, catch-all detection  
✅ **Explainable results** — every response includes raw verification signals  
✅ **Zero vendor lock-in** — same engine for hosted API and self-hosted deployments  
✅ **Production-ready** — rate limiting, bulk verification, webhook support  
✅ **Privacy-focused** — self-host for complete data control  
✅ **MIT licensed** — use commercially without restrictions

---

## Quick Start

### Hosted API (fastest)

```bash
npm install @verifio/sdk
```

```typescript
import { verifyEmail } from "@verifio/sdk";

const result = await verifyEmail("user@example.com");

console.log(result);
```

**Response:**
```json
{
  "status": "valid",
  "confidence": 0.92,
  "signals": {
    "syntax": true,
    "dns": true,
    "mx": true,
    "smtp": "accepted",
    "disposable": false,
    "catchAll": false,
    "roleAccount": false
  },
  "risk": "low",
  "provider": "gmail"
}
```

👉 [Get your free API key](https://verifio.email/signup)

---

### Self-Hosted (full control)

Deploy Verifio on your own infrastructure in under 2 minutes:

```bash
docker run -p 3000:3000 \
  -e SMTP_TIMEOUT=5000 \
  -e RATE_LIMIT=100 \
  verifio/verifio
```

Test the API:
```bash
curl http://localhost:3000/verify?email=user@example.com
```

For production deployments with Docker Compose, Kubernetes, or custom configurations, see the [Self-Hosting Guide](https://verifio.email/docs/self-hosting).

---

## How Email Verification Works

Verifio combines multiple verification layers to determine email validity:

| Layer | What it checks |
|-------|----------------|
| **Syntax validation** | RFC 5322 compliance, structure validation |
| **DNS resolution** | Domain exists and has valid records |
| **MX records** | Mail servers are configured and reachable |
| **SMTP handshake** | Server accepts the mailbox (no email sent) |
| **Catch-all detection** | Identifies domains that accept all addresses |
| **Disposable detection** | Flags temporary/throwaway email services |
| **Role account detection** | Identifies generic addresses (info@, support@) |

Every result includes **raw signals** from each layer — no hidden logic.

---

## Use Cases

Verifio is built for real-world products and data pipelines:

- ✉️ **User onboarding** — validate emails during signup to reduce fake accounts
- 📊 **Lead capture forms** — ensure high-quality contact data from day one
- 🔄 **CRM & marketing automation** — clean lists before campaigns to improve deliverability
- 🛒 **E-commerce & marketplaces** — prevent fraud and improve user trust
- 🧹 **Bulk email list cleaning** — verify thousands of emails efficiently
- 🔗 **Data enrichment pipelines** — integrate verification into ETL workflows

If email quality affects deliverability, trust, or revenue — Verifio fits.

---

## Hosted vs Self-Hosted

|  | Hosted API | Self-Hosted |
|---|------------|-------------|
| **Setup time** | Instant (API key) | ~5 minutes |
| **Free tier** | ✅ 1,000 verifications/month | ✅ Unlimited |
| **Scalability** | Automatic | You control |
| **Data privacy** | Our infrastructure | Your infrastructure |
| **Maintenance** | Zero | You manage |
| **Best for** | SaaS products, growth teams | Enterprises, compliance-sensitive apps |

Both options use the **same verification engine** — same logic, same results.

---

## Comparison with Alternatives

| Feature | Verifio | ZeroBounce | Emailable | Other OSS |
|---------|---------|------------|-----------|-----------|
| open-source code | ✅ | ❌ | ❌ | ⚠️ Limited |
| Explainable results | ✅ | ❌ | ❌ | ❌ |
| Self-hosting | ✅ | ❌ | ❌ | ✅ |
| Free tier | ✅ 1,000/mo | ⚠️ 100 credits | ⚠️ 250 credits | N/A |
| Commercial use | ✅ MIT | ⚠️ Paid only | ⚠️ Paid only | ⚠️ Varies |
| API-first design | ✅ | ⚠️ | ⚠️ | ⚠️ |

---

## Contributing

We welcome contributions from the community! Here's how you can help:

- 🐛 [Report bugs](https://github.com/verifio-email/verifio/issues)
- 💡 [Request features](https://github.com/verifio-email/verifio/discussions)
- 🔧 [Submit pull requests](https://github.com/verifio-email/verifio/pulls)
- 📖 Improve documentation
- ⭐ Star the repo to show support

Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

---

## Roadmap

- [ ] Bulk verification API endpoint
- [ ] Webhook support for async verification
- [ ] Email reputation scoring
- [ ] Integration with popular CRM platforms
- [ ] Advanced catch-all detection with AI
- [ ] Multi-language SDK support (Python, Go, Ruby)

See the [full roadmap](https://github.com/verifio-email/verifio/projects) and vote on features.

---

## License

Verifio is licensed under the [MIT License](LICENSE). You're free to use, modify, and distribute it — even commercially.

---

## Links

- 🌐 **Website:** [verifio.email](https://verifio.email)
- 📘 **Documentation:** [verifio.email/docs](https://verifio.email/docs)
- ⭐ **GitHub:** [github.com/verifio-email/verifio](https://github.com/verifio-email/verifio)
- 💬 **Community:** [Discord](https://discord.gg/verifio) • [Twitter](https://twitter.com/verifio)

---

<div align="center">

**Built with ❤️ by developers, for developers**

If Verifio helps your project, consider [sponsoring development](https://github.com/sponsors/verifio-email) or giving us a ⭐

</div>
