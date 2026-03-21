using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Verifio.Models;

namespace Verifio
{
    public class BulkService
    {
        private readonly VerifioClient _client;

        public BulkService(VerifioClient client)
        {
            _client = client;
        }

        public Task<BulkVerificationJob?> VerifyAsync(IEnumerable<string> emails)
        {
            var body = new Dictionary<string, object>
            {
                { "emails", emails }
            };

            return _client.RequestAsync<BulkVerificationJob>(HttpMethod.Post, "/bulk", body);
        }

        public Task<BulkVerificationJob?> GetJobAsync(string id)
        {
            return _client.RequestAsync<BulkVerificationJob>(HttpMethod.Get, $"/bulk-jobs/{id}");
        }

        public Task<PaginatedData<VerificationResult>?> GetResultsAsync(string id, PaginationOptions? options = null)
        {
            var page = options?.Page ?? 1;
            var limit = options?.Limit ?? 20;

            return _client.RequestAsync<PaginatedData<VerificationResult>>(HttpMethod.Get, $"/bulk-jobs/{id}/results?page={page}&limit={limit}");
        }
    }
}
