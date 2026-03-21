using System.Net.Http;

namespace Verifio
{
    public class VerifioSdk
    {
        private readonly VerifioClient _client;
        
        public VerifyService Verify { get; }
        public BulkService Bulk { get; }
        public HistoryService History { get; }

        public VerifioSdk(string apiKey, HttpClient? httpClient = null) : this(new VerifioConfig { ApiKey = apiKey }, httpClient)
        {
        }

        public VerifioSdk(VerifioConfig config, HttpClient? httpClient = null)
        {
            _client = new VerifioClient(config, httpClient ?? new HttpClient());
            
            Verify = new VerifyService(_client);
            Bulk = new BulkService(_client);
            History = new HistoryService(_client);
        }
    }
}
