using System.Net.Http;

namespace AzureADSample.Functions.Api
{
    public class ApiClient
    {
        public HttpClient HttpClient;

        public ApiClient(HttpClient httpClient)
        {
            HttpClient = httpClient;
        }
    }
}
