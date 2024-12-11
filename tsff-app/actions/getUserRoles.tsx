"use server";
import { createClient } from "@/utils/supabase/server";

type Role = {
  id: string;
  role_name: string;
};

interface UserRole {
  roleId: string;
  roleName: string;
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select(
      `
      roles (
        id,
        role_name
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user roles:", error);
    throw new Error("Failed to fetch user roles.");
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Explicitly cast `data` to `UserRoleRecord[]`
  const typedData = data as { roles: Role[] }[];

  const formattedData: UserRole[] = typedData.flatMap((record) => {
    const roles = Array.isArray(record.roles) ? record.roles : [record.roles];
    return roles.map((role) => {
      return {
        roleId: role.id,
        roleName: role.role_name,
      };
    });
  });
  console.log("formattedData", formattedData);
  return formattedData;
}
