using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using taskmaster.api.Controllers;
using taskmaster.api.DTOs.Auth;
using taskmaster.api.DTOs.Users;
using taskmaster.api.Services.Interfaces;

namespace taskmaster.tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<ILogger<AuthController>> _mockLogger;
        private readonly AuthController _sut;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _mockLogger = new Mock<ILogger<AuthController>>();
            _sut = new AuthController(_mockAuthService.Object, _mockLogger.Object);

            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        private void SetAuthenticatedUser(string username)
        {
            var claims = new[] { new Claim(ClaimTypes.Name, username) };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            _sut.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
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

        [Fact]
        public async Task Logout_ShouldReturn200_AndClearCookies()
        {
            SetAuthenticatedUser("aleem");

            _mockAuthService
                .Setup(s => s.LogoutAsync("aleem"))
                .Returns(Task.CompletedTask);

            var result = await _sut.Logout();

            result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);

            var cookies = _sut.HttpContext.Response.Headers["Set-Cookie"].ToString();
            cookies.Should().Contain("accessToken");
            cookies.Should().Contain("refreshToken");
        }

        [Fact]
        public async Task Logout_ShouldCallLogoutAsync_WhenUserIsAuthenticated()
        {
            SetAuthenticatedUser("john");

            _mockAuthService
                .Setup(s => s.LogoutAsync("john"))
                .Returns(Task.CompletedTask);

            await _sut.Logout();

            _mockAuthService.Verify(s => s.LogoutAsync("john"), Times.Once);
        }

        [Fact]
        public async Task Logout_ShouldStillReturn200_WhenUserIsNotAuthenticated()
        {
            var result = await _sut.Logout();

            result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);

            _mockAuthService.Verify(s => s.LogoutAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task Refresh_ShouldReturn401_WhenNoCookiePresent()
        {
            // Default HttpContext has no cookies
            var result = await _sut.Refresh();

            result.Should().BeOfType<UnauthorizedObjectResult>()
                .Which.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task Refresh_ShouldReturn401_AndClearCookies_WhenTokenIsInvalid()
        {
            var context = new DefaultHttpContext();
            context.Request.Headers["Cookie"] = "refreshToken=bad-token";
            _sut.ControllerContext = new ControllerContext { HttpContext = context };

            _mockAuthService
                .Setup(s => s.RefreshTokenAsync("bad-token"))
                .ReturnsAsync(new AuthResultDto { Success = false });

            var result = await _sut.Refresh();

            result.Should().BeOfType<UnauthorizedObjectResult>()
                .Which.StatusCode.Should().Be(401);

            var cookies = _sut.HttpContext.Response.Headers["Set-Cookie"].ToString();
            cookies.Should().Contain("accessToken");
            cookies.Should().Contain("refreshToken");
        }

        [Fact]
        public async Task Refresh_ShouldReturn200_AndSetNewCookies_WhenTokenIsValid()
        {
            var context = new DefaultHttpContext();
            context.Request.Headers["Cookie"] = "refreshToken=valid-token";
            _sut.ControllerContext = new ControllerContext { HttpContext = context };

            _mockAuthService
                .Setup(s => s.RefreshTokenAsync("valid-token"))
                .ReturnsAsync(new AuthResultDto
                {
                    Success = true,
                    AccessToken = "new-access-token",
                    RefreshToken = "new-refresh-token",
                    Expiry = DateTime.UtcNow.AddDays(7)
                });

            var result = await _sut.Refresh();

            result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);

            var cookies = _sut.HttpContext.Response.Headers["Set-Cookie"].ToString();
            cookies.Should().Contain("accessToken");
            cookies.Should().Contain("refreshToken");
        }

        [Fact]
        public async Task GetMyProfile_ShouldReturn200_WhenUserIsAuthenticated()
        {
            SetAuthenticatedUser("aleem");

            _mockAuthService
                .Setup(s => s.GetProfileAsync("aleem"))
                .ReturnsAsync(new UserProfileDto
                {
                    Id = 1,
                    FullName = "Aleem Khan",
                    Username = "aleem",
                    Role = "User",
                    JoinDate = new DateTime(2024, 1, 1)
                });

            var result = await _sut.GetMyProfile();

            result.Should().BeOfType<OkObjectResult>()
                .Which.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetMyProfile_ShouldReturn401_WhenUsernameIsNotInIdentity()
        {
            var result = await _sut.GetMyProfile();

            result.Should().BeOfType<UnauthorizedResult>();
        }

        [Fact]
        public async Task GetMyProfile_ShouldReturn404_WhenProfileNotFound()
        {
            SetAuthenticatedUser("aleem");

            _mockAuthService
                .Setup(s => s.GetProfileAsync("aleem"))
                .ReturnsAsync((UserProfileDto?)null);

            var result = await _sut.GetMyProfile();

            result.Should().BeOfType<NotFoundResult>();
        }
    }
}