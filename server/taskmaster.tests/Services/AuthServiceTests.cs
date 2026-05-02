using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using taskmaster.api.Models;
using taskmaster.api.Repositories;
using taskmaster.api.Services;

namespace taskmaster.tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly IAuthService _sut;

        private const string TestToken = "THIS_IS_A_VERY_LONG_DEVELOPMENT_ONLY_SECRET_KEY_FOR_JWT_TESTING_123456";

        public AuthServiceTests()
        {
            _mockUserRepo = new Mock<IUserRepository>();
            _mockConfig = new Mock<IConfiguration>();

            _mockConfig.Setup(c => c["AppSettings:Token"])
                       .Returns(TestToken);

            _sut = new AuthService(_mockConfig.Object , _mockUserRepo.Object);
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnFalse_WhenUsernameAlreadyExists()
        {
            _mockUserRepo
                .Setup(r => r.GetByUsernameAsync("existinguser"))
                .ReturnsAsync(new User { Username = "existinguser" });

            var result = await _sut.RegisterAsync("Full Name", "existinguser", "password");

            result.Should().BeFalse();
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnTrue_AndAddUser_WhenUsernameIsAvailable()
        {
            _mockUserRepo
                .Setup(r => r.GetByUsernameAsync("newuser"))
                .ReturnsAsync((User?)null);

            _mockUserRepo
                .Setup(r => r.AddAsync(It.IsAny<User>()))
                .Returns(Task.CompletedTask);

            var result = await _sut.RegisterAsync("Full Name", "newuser", "securepassword");

            result.Should().BeTrue();
            _mockUserRepo.Verify(
                r => r.AddAsync(It.Is<User>(u => u.Username == "newuser")),
                Times.Once
            );
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnFailure_WhenUserDoesNotExist()
        {
            _mockUserRepo
                .Setup(r => r.GetByUsernameAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            var result = await _sut.LoginAsync("ghost", "password");

            result.Success.Should().BeFalse();
            result.AccessToken.Should().BeNullOrEmpty();
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnFailure_WhenPasswordIsWrong()
        {
            var user = new User
            {
                Username = "aleem",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct")
            };

            _mockUserRepo.Setup(r => r.GetByUsernameAsync("aleem")).ReturnsAsync(user);

            var result = await _sut.LoginAsync("aleem", "wrongpassword");

            result.Success.Should().BeFalse();
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnTokens_WhenCredentialsAreValid()
        {
            var user = new User
            {
                Username = "aleem",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct")
            };

            _mockUserRepo.Setup(r => r.GetByUsernameAsync("aleem")).ReturnsAsync(user);

            var result = await _sut.LoginAsync("aleem", "correct");

            result.Success.Should().BeTrue();
            result.AccessToken.Should().NotBeNullOrEmpty();
            result.RefreshToken.Should().NotBeNullOrEmpty();
        }
    }
}