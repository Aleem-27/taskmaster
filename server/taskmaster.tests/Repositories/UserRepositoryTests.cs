using FluentAssertions;
using taskmaster.api.Models;
using taskmaster.api.Repositories;
using taskmaster.tests.Helpers;
using taskmaster.api.Data;

namespace taskmaster.tests.Repositories
{
    public class UserRepositoryTests : IDisposable
    {
        private readonly UserRepository _sut;
        private readonly AppDbContext _context;

        public UserRepositoryTests()
        {
            _context = MockDbContextFactory.Create();
            _sut = new UserRepository(_context);
        }

        [Fact]
        public async Task GetByUsernameAsync_ShouldReturnUser_WhenUserExists()
        {
            _context.Users.Add(new User { Username = "aleem", PasswordHash = "hash", FullName = "Aleem" });
            await _context.SaveChangesAsync();

            var result = await _sut.GetByUsernameAsync("aleem");

            result.Should().NotBeNull();
            result!.Username.Should().Be("aleem");
        }

        [Fact]
        public async Task GetByUsernameAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            var result = await _sut.GetByUsernameAsync("nonexistent");

            result.Should().BeNull();
        }

        [Fact]
        public async Task AddAsync_ShouldPersistUser()
        {
            var user = new User { Username = "fahad", PasswordHash = "hash", FullName = "Fahad" };

            await _sut.AddAsync(user);

            var persisted = await _sut.GetByUsernameAsync("fahad");
            persisted.Should().NotBeNull();
            persisted!.FullName.Should().Be("Fahad");
        }

        [Fact]
        public async Task UpdateAsync_ShouldModifyExistingUser()
        {
            var user = new User { Username = "zohaib", PasswordHash = "oldhash", FullName = "Zohaib" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            user.PasswordHash = "newhash";
            await _sut.UpdateAsync(user);

            var updated = await _sut.GetByUsernameAsync("zohaib");
            updated!.PasswordHash.Should().Be("newhash");
        }

        public void Dispose() => _context.Dispose();
    }
}