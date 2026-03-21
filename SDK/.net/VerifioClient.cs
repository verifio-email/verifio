using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Verifio.Exceptions;
using Verifio.Models;

namespace Verifio
{
    public class VerifioConfig
    {
        public string ApiKey { get; set; } = string.Empty;
        public string? BaseUrl { get; set; }
    }

    public class VerifioClient
    {
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonOptions;

        public VerifioClient(VerifioConfig config, HttpClient httpClient)
        {
            if (string.IsNullOrWhiteSpace(config.ApiKey))
            {
                throw new ValidationException("API key is required");
            }
            
            _apiKey = config.ApiKey;
            _baseUrl = (string.IsNullOrWhiteSpace(config.BaseUrl) ? "https://verifio.email" : config.BaseUrl).TrimEnd('/');
            _httpClient = httpClient;
            _httpClient.Timeout = TimeSpan.FromSeconds(30);

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            };
        }

        public async Task<T?> RequestAsync<T>(HttpMethod method, string path, object? body = null)
        {
            var url = $"{_baseUrl}/api/verify/v1{path}";
            var request = new HttpRequestMessage(method, url);
            
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            if (body != null)
            {
                var jsonBody = JsonSerializer.Serialize(body, _jsonOptions);
                request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
            }

            HttpResponseMessage response;
            try
            {
                response = await _httpClient.SendAsync(request);
            }
            catch (Exception ex)
            {
                throw new VerifioException($"Network error: {ex.Message}");
            }

            var contentString = await response.Content.ReadAsStringAsync();
            var status = (int)response.StatusCode;

            ApiResponse<T>? apiResponse = null;
            try
            {
                // We use a general JsonElement approach to cleanly parse errors too
                var rawRes = JsonSerializer.Deserialize<ApiResponse<JsonElement>>(contentString, _jsonOptions);
                if (rawRes != null)
                {
                    apiResponse = new ApiResponse<T>
                    {
                        Success = rawRes.Success,
                        Error = rawRes.Error,
                    };
                    
                    if (rawRes.Success && rawRes.Data.ValueKind != JsonValueKind.Undefined && rawRes.Data.ValueKind != JsonValueKind.Null)
                    {
                        apiResponse.Data = JsonSerializer.Deserialize<T>(rawRes.Data.GetRawText(), _jsonOptions);
                    }
                    
                    if (!rawRes.Success)
                    {
                        HandleError(status, rawRes.Error, rawRes.Data);
                    }
                }
            }
            catch (VerifioException) { throw; } // rethrow
            catch
            {
                // Parse failed
                if (status >= 400)
                {
                    HandleError(status, $"HTTP Error {status}", default);
                }
                throw new VerifioException("Invalid JSON response from server");
            }

            if (status < 200 || status >= 300 || (apiResponse is { Success: false }))
            {
                HandleError(status, apiResponse?.Error, default);
            }

            return apiResponse != null ? apiResponse.Data : default;
        }

        private void HandleError(int status, string? message, JsonElement data)
        {
            message ??= "An error occurred";

            int? GetIntField(string field)
            {
                if (data.ValueKind == JsonValueKind.Object && data.TryGetProperty(field, out var prop) && prop.TryGetInt32(out var val))
                    return val;
                return null;
            }

            switch (status)
            {
                case 401:
                    throw new AuthenticationException(message);
                case 402:
                    throw new InsufficientCreditsException(message, GetIntField("remaining"), GetIntField("required"));
                case 404:
                    throw new NotFoundException(message);
                case 429:
                    throw new RateLimitException(message, null);
                case 400:
                    throw new ValidationException(message);
                case 500:
                case 502:
                case 503:
                    throw new ServerException(message);
                default:
                    throw new VerifioException(message, status, null);
            }
        }
    }
}
