using System;

namespace Verifio.Exceptions
{
    public class VerifioException : Exception
    {
        public int? StatusCode { get; }
        public string? Code { get; }

        public VerifioException(string message) : base(message) { }

        public VerifioException(string message, int statusCode, string? code) : base(message)
        {
            StatusCode = statusCode;
            Code = code;
        }

        public override string ToString()
        {
            if (Code != null)
            {
                return $"VerifioException [{StatusCode} {Code}]: {Message}";
            }
            if (StatusCode != null)
            {
                return $"VerifioException [{StatusCode}]: {Message}";
            }
            return $"VerifioException: {Message}";
        }
    }

    public class AuthenticationException : VerifioException
    {
        public AuthenticationException(string message) : base(message, 401, "AUTHENTICATION_ERROR") { }
    }

    public class InsufficientCreditsException : VerifioException
    {
        public int? Remaining { get; }
        public int? Required { get; }

        public InsufficientCreditsException(string message, int? remaining, int? required) 
            : base(message, 402, "INSUFFICIENT_CREDITS")
        {
            Remaining = remaining;
            Required = required;
        }
    }

    public class NotFoundException : VerifioException
    {
        public NotFoundException(string message) : base(message, 404, "NOT_FOUND") { }
    }

    public class RateLimitException : VerifioException
    {
        public int? RetryAfter { get; }

        public RateLimitException(string message, int? retryAfter) : base(message, 429, "RATE_LIMIT_EXCEEDED")
        {
            RetryAfter = retryAfter;
        }
    }

    public class ValidationException : VerifioException
    {
        public ValidationException(string message) : base(message, 400, "VALIDATION_ERROR") { }
    }

    public class ServerException : VerifioException
    {
        public ServerException(string message) : base(message, 500, "SERVER_ERROR") { }
    }
}
