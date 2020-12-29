using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            
            if(!context.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UsersSeedData.json");
                JsonSerializerOptions options = new()
                {
                    ReferenceHandler = ReferenceHandler.Preserve,
                    WriteIndented = true,
                };
                var users =  JsonSerializer.Deserialize<List<User>>(userData,options);
                foreach(var user in users)
                {
                  
                    byte[] passwordhash, passwordSalt;
                    CreatPasswordHash("password",out passwordhash, out passwordSalt);

                    user.PasswordHash = passwordhash;
                    user.PasswordSalt= passwordSalt;
                    user.UserName = user.UserName.ToLower();
                    context.Users.Add(user);

                }
                context.SaveChanges();
            }
        }

        private static void CreatPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}