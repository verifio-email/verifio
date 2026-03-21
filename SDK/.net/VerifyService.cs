using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Verifio.Models;

namespace Verifio
{
    public class VerifyService
    {
        private readonly VerifioClient _client;

        public VerifyService(VerifioClient client)
        {
            _client = client;
        }

        public Task<VerificationResult?> VerifyAsync(string email, VerifyOptions? options = null)
        {
            var body = new Dictionary<string, object>
            {
                { "email", email }
            };

            if (options != null)
            {
                body.Add("options", options);
            }

            return _client.RequestAsync<VerificationResult>(HttpMethod.Post, "/verify", body);
        }
    }
}
