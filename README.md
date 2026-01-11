# Verifio

Open-source email verification infrastructure — transparent, self-hostable, and free to start.

⭐ An open-source alternative to ZeroBounce, Emailable

---

## Why Verifio?

Most email verification tools are **black boxes**.

They tell you an email is “valid” or “emailable” — but never explain *why*.  
You’re forced to trust proprietary logic you can’t inspect, audit, or control.

**Verifio was built to change that.**

We believe email verification should be:

- 🔍 **Transparent** — see the signals behind every result  
- 🔓 **Open source** — audit the logic, not just the output  
- 🧩 **Self-hostable** — no vendor lock-in  
- ⚙️ **Infrastructure** — not just another SaaS tool  

---

## What is Verifio?

Verifio is an **open-source email verification engine** with a hosted SaaS offering.

You can:

- Use the **hosted API** (free to start)
- **Self-host** the open-source core
- Integrate verification directly into your product, forms, or data pipelines

The **same engine powers everything** — no hidden logic.

---

## How email verification works (openly)

Verifio combines multiple verification signals to determine email validity:

1. Syntax & domain validation  
2. MX & DNS resolution  
3. SMTP handshake (no email is sent)  
4. Catch-all detection  
5. Disposable & role-based email detection  
6. Risk & confidence aggregation  

Every verification result includes the **raw signals** used to make the decision.

---

## Quick example

```ts
import { verifyEmail } from "@verifio/sdk";

const result = await verifyEmail("user@example.com");

console.log(result);
{
  "status": "valid",
  "confidence": 0.92,
  "signals": {
    "mx": true,
    "smtp": "accepted",
    "disposable": false,
    "catchAll": false
  }
}
```
The same result format is returned whether you use the hosted API or self-host Verifio.

Hosted API or Self-Hosted — your choice
Hosted API
    •    Zero setup
    •    Free tier available
    •    Automatically scalable
    •    Ideal for production SaaS and growth teams
👉 https://verifio.email (https://verifio.email/)

Self-hosted
    •    Run the verification engine yourself
    •    Full control & privacy
    •    Same logic, same results
    •    No vendor lock-in
👉 See the self-hosting guide below

Self-hosting
Verifio can be self-hosted using Docker:
docker run -p 3000:3000 verifio/verifio
Once running, the API will be available at:
http://localhost:3000/verify
For production deployments, see:
    •    Docker Compose
    •    Environment variables
    •    Rate limiting
    •    SMTP configuration
👉 docs/self-hosting.md

Common use cases
Verifio is built for real products and real pipelines:
    •    User signup & onboarding flows
    •    Lead capture forms
    •    CRM & marketing automation
    •    Marketplaces and communities
    •    Bulk email list cleaning
    •    Data enrichment pipelines
If email quality affects deliverability, trust, or revenue — Verifio fits.

How Verifio compares
Feature
Verifio
Traditional Tools
Open-source core
✅
❌
Explainable results
✅
❌
Self-hosting
✅
❌
API & SDK first
✅
⚠️
Free tier
✅
⚠️
Verifio is an open-source alternative to ZeroBounce Emailable.

Built in the open
    •    MIT licensed
    •    Public roadmap
    •    Transparent changelog
    •    Community-driven development
We welcome:
    •    Issues
    •    Feature requests
    •    Pull requests
    •    Discussions
⭐ If you find Verifio useful, please star the repo — it helps a lot.

License
Verifio is licensed under the MIT License.
You’re free to use, modify, and distribute it — even commercially.

Links
    •    🌐 Website: https://verifio.email (https://verifio.email/)
    •    📘 Documentation: https://verifio.email/docs
    •    ⭐ GitHub: https://github.com/verifio-email/verifio
---
