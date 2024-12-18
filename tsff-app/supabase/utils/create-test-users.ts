const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const TEST_AVATAR_URL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F5556%2F5556468.png&f=1&nofb=1&ipt=ff88b9eef477dc327abffb1ff065968195d393abdb190961d6741241f13e6254&ipo=images";

async function fetchRoleId(roleName: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("roles")
    .select("id")
    .eq("role_name", roleName)
    .single();

  if (error) {
    console.error(`Failed to fetch role ID for ${roleName}:`, error.message);
    return null;
  }
  return data.id;
}

async function deleteExistingUsers(emails: string[]) {
  console.log("Cleaning up existing test users...");

  for (const email of emails) {
    // Fetch user by email
    const { data: users, error: fetchError } =
      await supabase.auth.admin.listUsers({
        filter: `email.eq.${email}`,
      });

    if (fetchError) {
      console.error(`Failed to fetch user ${email}:`, fetchError.message);
      continue;
    }

    const user = users?.users?.[0];
    if (!user) {
      console.log(`No existing user found for ${email}`);
      continue;
    }

    // Delete user by ID
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      console.error(`Failed to delete user ${email}:`, deleteError.message);
    } else {
      console.log(`Deleted user: ${email}`);
    }
  }
}

async function createTestUsers() {
  const ADMIN_COUNT = 1;
  const PLAYER_COUNT = 5;
  const REFEREE_COUNT = 3;

  // Admin user
  const adminUsers = Array.from({ length: ADMIN_COUNT }, (_, i) => ({
    email: `admin${i + 1}@example.com`,
    password: "password",
    name: `Admin ${i + 1}`,
    role: "admin",
  }));

  // Players
  const playerUsers = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
    email: `player${i + 1}@example.com`,
    password: "password",
    name: `Player ${i + 1}`,
    role: "player",
  }));

  // Referees
  const refereeUsers = Array.from({ length: REFEREE_COUNT }, (_, i) => ({
    email: `referee${i + 1}@example.com`,
    password: "password",
    name: `Referee ${i + 1}`,
    role: "referee",
  }));

  const users = [...adminUsers, ...playerUsers, ...refereeUsers];

  // Clean up existing users before creating new ones
  const userEmails = users.map((user) => user.email);
  await deleteExistingUsers(userEmails);

  // Fetch role IDs
  const roleIds = {
    admin: await fetchRoleId("admin"),
    player: await fetchRoleId("player"),
    referee: await fetchRoleId("referee"),
  };

  for (const user of users) {
    console.log(`Creating user: ${user.email}`);

    // Create user in Supabase auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

    if (authError) {
      console.error(`Failed to create user ${user.email}:`, authError.message);
      continue;
    }

    const userId = authData?.user?.id;
    if (!userId) {
      console.error(`No user ID returned for ${user.email}`);
      continue;
    }

    console.log(`User created: ${user.email} with ID ${userId}`);

    // Update the profiles table with name and avatar_url
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        name: user.name,
        avatar_url: TEST_AVATAR_URL,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error(
        `Failed to update profile for ${user.email}:`,
        profileUpdateError.message
      );
    } else {
      console.log(`Profile updated for ${user.email}`);
    }

    // Insert user role into user_roles table
    const roleId = roleIds[user.role as keyof typeof roleIds];
    if (!roleId) {
      console.error(`No role ID found for role ${user.role}`);
      continue;
    }

    const { error: userRoleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role_id: roleId,
    });

    if (userRoleError) {
      console.error(
        `Failed to assign role ${user.role} to ${user.email}:`,
        userRoleError.message
      );
    } else {
      console.log(`Role ${user.role} assigned to ${user.email}`);
    }
  }
}

createTestUsers()
  .then(() => {
    console.log("Test users created successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error creating test users:", err);
    process.exit(1);
  });
