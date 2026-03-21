# Verifio .NET SDK

Official .NET SDK for Verifio email verification.

## Installation

via NuGet:
```bash
dotnet add package Verifio
```

## Quick Start

```csharp
using System;
using System.Threading.Tasks;
using Verifio;
using Verifio.Models;

class Program
{
    static async Task Main(string[] args)
    {
        var verifio = new VerifioSdk("your-api-key");

        // Verify an email
        var result = await verifio.Verify.VerifyAsync("test@example.com");

        Console.WriteLine($"Result State: {result?.State}");
        Console.WriteLine($"Score: {result?.Score}");
    }
}
```

## Advanced Options Configuration

```csharp
var options = new VerifyOptions
{
    SkipDisposable = false,
    SkipRole = true,
};

var result = await verifio.Verify.VerifyAsync("test@example.com", options);
```
