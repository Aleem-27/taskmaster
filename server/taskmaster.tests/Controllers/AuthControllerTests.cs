using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using taskmaster.api.Controllers;
using taskmaster.api.DTOs;
using taskmaster.api.Services;

namespace taskmaster.tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _sut;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _sut = new AuthController(_mockAuthService.Object);

            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [Fact]
        public async Task Register_ShouldReturn200_WhenRegistrationSucceeds()
        {
            _mockAuthService
                .Setup(s => s.RegisterAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(true);

            var result = await _sut.Register(new RegisterDto
            {
                FullName = "Aleem",
                Username = "aleem",
                Password = "pass123"
            });

            result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task Register_ShouldReturn400_WhenUsernameTaken()
        {
            _mockAuthService
                .Setup(s => s.RegisterAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(false);

            var result = await _sut.Register(new RegisterDto
            {
                FullName = "Fahad",
                Username = "taken",
                Password = "pass"
            });

            result.Should().BeOfType<BadRequestObjectResult>()
                .Which.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task Login_ShouldReturn200_AndSetCookies_WhenCredentialsAreValid()
        {
            _mockAuthService
                .Setup(s => s.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new AuthResultDto
                {
                    Success = true,
                    AccessToken = "access-token",
                    RefreshToken = "refresh-token",
                    Expiry = DateTime.UtcNow.AddDays(7)
                });

            var result = await _sut.Login(new LoginDto { Username = "aleem", Password = "correct" });

            result.Should().BeOfType<OkObjectResult>();

            var cookies = _sut.HttpContext.Response.Headers["Set-Cookie"].ToString();
            cookies.Should().Contain("accessToken");
            cookies.Should().Contain("refreshToken");
        }

        [Fact]
        public async Task Login_ShouldReturn400_WhenCredentialsAreInvalid()
        {
            _mockAuthService
                .Setup(s => s.LoginAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new AuthResultDto { Success = false });

            var result = await _sut.Login(new LoginDto { Username = "aleem", Password = "wrong" });

            result.Should().BeOfType<BadRequestObjectResult>()
                .Which.StatusCode.Should().Be(400);
        }
    }
}