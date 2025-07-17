"use server";
/**
 * @purpose This file contains all the server procedures
 */

import { getUser } from "@/lib/supabase/auth";
import { ensureUserExists } from "@/lib/supabase/user-sync";
import { type User } from "@supabase/supabase-js";
import { usersRoleEnum, type users } from "@/server/db/schema";
import { z } from "zod";

const userRoles = z.enum(usersRoleEnum.enumValues);

type AppUser = typeof users.$inferSelect;

/**
 * @purpose This is a protected procedure
 * @description This procedure is protected and can only be accessed by authenticated users
 * */

export const protectedProcedure = async () => {
    const authUser = await getUser();

    if (!authUser) {
        throw new Error("You are not authenticated");
    }

    // Ensure user exists in application database
    const appUser = await ensureUserExists();

    if (!appUser) {
        throw new Error("Failed to sync user data");
    }

    return {
        user: appUser as AppUser,
        authUser: authUser as User,
    };
};

/**
 * @purpose This is an admin procedure
 * @description This procedure is protected and can only be accessed by admins
 * */

export const adminProcedure = async () => {
    const authUser = await getUser();

    if (!authUser) {
        throw new Error("You are not authenticated");
    }

    // Ensure user exists in application database
    const appUser = await ensureUserExists();

    if (!appUser) {
        throw new Error("Failed to sync user data");
    }

    if (
        appUser.role !== userRoles.Values.Admin &&
        appUser.role !== userRoles.Values["Super Admin"]
    ) {
        throw new Error("You are not authorized to perform this action");
    }

    return {
        user: appUser as AppUser,
        authUser: authUser as User,
    };
};

/**
 * @purpose This is a super admin procedure
 * @description This procedure is protected and can only be accessed by super admins
 * */

export const superAdminProcedure = async () => {
    const authUser = await getUser();

    if (!authUser) {
        throw new Error("You are not authenticated");
    }

    // Ensure user exists in application database
    const appUser = await ensureUserExists();

    if (!appUser) {
        throw new Error("Failed to sync user data");
    }

    if (appUser.role !== userRoles.Values["Super Admin"]) {
        throw new Error("You are not authorized to perform this action");
    }

    return {
        user: appUser as AppUser,
        authUser: authUser as User,
    };
};
