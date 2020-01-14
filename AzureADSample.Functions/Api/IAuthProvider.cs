using System.Threading.Tasks;

namespace AzureADSample.Functions.Api
{
    public interface IAuthProvider
    {
        Task<string> GetToken();
    }
}
