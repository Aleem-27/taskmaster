using Microsoft.EntityFrameworkCore;
using taskmaster.api.Data;

namespace taskmaster.tests.Helpers
{
    public static class MockDbContextFactory
    {
        public static AppDbContext Create(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName ?? Guid.NewGuid().ToString()) // unique DB per test
                .Options;

            var context = new AppDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }
    }
}