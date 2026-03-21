# Verifio Java SDK

Official Java SDK for Verifio email verification.

## Installation

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>com.reloop</groupId>
    <artifactId>verifio-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

Alternatively, build it locally and install to your local repository:
```bash
mvn clean install
```

## Quick Start

```java
import com.reloop.verifio.Verifio;
import com.reloop.verifio.types.VerificationResult;

public class App {
    public static void main(String[] args) {
        Verifio verifio = new Verifio("your-api-key");

        // Verify an email
        VerificationResult result = verifio.verify.verify("test@example.com", null);

        System.out.println("Result State: " + result.getState());
        System.out.println("Score: " + result.getScore());
    }
}
```

## Options Configuration

```java
import com.reloop.verifio.types.VerifyOptions;

VerifyOptions options = new VerifyOptions();
options.setSkipDisposable(false);
options.setSkipRole(false);

VerificationResult result = verifio.verify.verify("test@example.com", options);
```
