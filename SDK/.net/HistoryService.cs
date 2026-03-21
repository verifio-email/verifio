using System.Net.Http;
using System.Threading.Tasks;
using Verifio.Models;

namespace Verifio
{
    public class HistoryService
    {
        private readonly VerifioClient _client;

        public HistoryService(VerifioClient client)
        {
            _client = client;
        }

        public Task<PaginatedData<VerificationResult>?> ListAsync(PaginationOptions? options = null)
        {
            var page = options?.Page ?? 1;
            var limit = options?.Limit ?? 20;

            return _client.RequestAsync<PaginatedData<VerificationResult>>(HttpMethod.Get, $"/history?page={page}&limit={limit}");
        }
    }
}
