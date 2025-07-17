import { relations, sql } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTableCreator,
    primaryKey,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// Removed NextAuth adapter types - using Supabase Auth instead
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
    (name) => `bizpulse_${name}`,
);

export const usersRoleEnum = pgEnum("role", ["User", "Admin", "Super Admin", "saas_owner", "business_owner", "manager", "staff"]);

export const users = createTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
        mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
    role: usersRoleEnum("role").default("User").notNull(),
    isNewUser: boolean("isNewUser").default(true).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    membersToOrganizations: many(membersToOrganizations),
    feedback: many(feedback),
    businesses: many(businesses),
}));

export const userInsertSchema = createInsertSchema(users, {
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
    email: z.string().email(),
    image: z.string().url(),
});

export const accounts = createTable(
    "account",
    {
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id),
        type: varchar("type", { length: 255 })
            .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", {
            length: 255,
        }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
        userIdIdx: index("account_userId_idx").on(account.userId),
    }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    "session",
    {
        sessionToken: varchar("sessionToken", { length: 255 })
            .notNull()
            .primaryKey(),
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (session) => ({
        userIdIdx: index("session_userId_idx").on(session.userId),
    }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    }),
);

export const organizations = createTable("organization", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    ownerId: varchar("ownerId", { length: 255 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const createOrgInsertSchema = createInsertSchema(organizations, {
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
    image: z.string().url({ message: "Invalid image URL" }),
});

export const organizationsRelations = relations(
    organizations,
    ({ one, many }) => ({
        owner: one(users, {
            fields: [organizations.ownerId],
            references: [users.id],
        }),
        membersToOrganizations: many(membersToOrganizations),
        subscriptions: one(subscriptions, {
            fields: [organizations.id],
            references: [subscriptions.orgId],
        }),
    }),
);

export const membersToOrganizationsRoleEnum = pgEnum("org-member-role", [
    "Viewer",
    "Developer",
    "Billing",
    "Admin",
]);

export const membersToOrganizations = createTable(
    "membersToOrganizations",
    {
        id: varchar("id", { length: 255 }).default(sql`gen_random_uuid()`),
        memberId: varchar("memberId", { length: 255 })
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        memberEmail: varchar("memberEmail", { length: 255 }).notNull(),
        organizationId: varchar("organizationId", { length: 255 })
            .notNull()
            .references(() => organizations.id, { onDelete: "cascade" }),
        role: membersToOrganizationsRoleEnum("role")
            .default("Viewer")
            .notNull(),
        createdAt: timestamp("createdAt", { mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (mto) => ({
        compoundKey: primaryKey({
            columns: [mto.id, mto.memberId, mto.organizationId],
        }),
    }),
);

export const membersToOrganizationsRelations = relations(
    membersToOrganizations,
    ({ one }) => ({
        member: one(users, {
            fields: [membersToOrganizations.memberId],
            references: [users.id],
        }),
        organization: one(organizations, {
            fields: [membersToOrganizations.organizationId],
            references: [organizations.id],
        }),
    }),
);

export const membersToOrganizationsInsertSchema = createInsertSchema(
    membersToOrganizations,
);

export const orgRequests = createTable(
    "orgRequest",
    {
        id: varchar("id", { length: 255 })
            .notNull()
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        organizationId: varchar("organizationId", {
            length: 255,
        })
            .notNull()
            .references(() => organizations.id, { onDelete: "cascade" }),
        createdAt: timestamp("createdAt", { mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (or) => ({
        orgIdIdx: index("orgRequest_organizationId_idx").on(or.organizationId),
    }),
);

export const orgRequestsRelations = relations(orgRequests, ({ one }) => ({
    user: one(users, { fields: [orgRequests.userId], references: [users.id] }),
    organization: one(organizations, {
        fields: [orgRequests.organizationId],
        references: [organizations.id],
    }),
}));

export const orgRequestInsertSchema = createInsertSchema(orgRequests);

// Feedback schema

export const feedbackLabelEnum = pgEnum("feedback-label", [
    "Issue",
    "Idea",
    "Question",
    "Complaint",
    "Feature Request",
    "Other",
]);

export const feedbackStatusEnum = pgEnum("feedback-status", [
    "Open",
    "In Progress",
    "Closed",
]);

export const feedback = createTable("feedback", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    userId: varchar("userId", { length: 255 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }),
    message: text("message").notNull(),
    label: feedbackLabelEnum("label").notNull(),
    status: feedbackStatusEnum("status").default("Open").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const feedbackRelations = relations(feedback, ({ one }) => ({
    user: one(users, { fields: [feedback.userId], references: [users.id] }),
}));

export const feedbackInsertSchema = createInsertSchema(feedback, {
    title: z
        .string()
        .min(3, "Title is too short")
        .max(255, "Title is too long"),
    message: z
        .string()
        .min(10, "Message is too short")
        .max(1000, "Message is too long"),
});

export const feedbackSelectSchema = createSelectSchema(feedback, {
    title: z
        .string()
        .min(3, "Title is too short")
        .max(255, "Title is too long"),
    message: z
        .string()
        .min(10, "Message is too short")
        .max(1000, "Message is too long"),
});

export const webhookEvents = createTable("webhookEvent", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    eventName: text("eventName").notNull(),
    processed: boolean("processed").default(false),
    body: jsonb("body").notNull(),
    processingError: text("processingError"),
});

export const subscriptions = createTable("subscription", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    lemonSqueezyId: text("lemonSqueezyId").unique().notNull(),
    orderId: integer("orderId").notNull(),
    orgId: text("orgId")
        .notNull()
        .references(() => organizations.id, { onDelete: "cascade" }),
    variantId: integer("variantId").notNull(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    organization: one(organizations, {
        fields: [subscriptions.orgId],
        references: [organizations.id],
    }),
}));

export const waitlistUsers = createTable("waitlistUser", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const waitlistUsersSchema = createInsertSchema(waitlistUsers, {
    email: z.string().email("Email must be a valid email address"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
});

// BizPulse specific schemas

// Customer source enum
export const customerSourceEnum = pgEnum("customer-source", ["qr", "manual"]);

// Message type and status enums
export const messageTypeEnum = pgEnum("message-type", ["email", "sms"]);
export const messageStatusEnum = pgEnum("message-status", ["pending", "sent", "failed"]);
export const messageProviderEnum = pgEnum("message-provider", ["sendgrid", "resend", "twilio"]);

// Businesses table
export const businesses = createTable("business", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    ownerId: varchar("ownerId", { length: 255 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    industry: varchar("industry", { length: 255 }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const businessesRelations = relations(businesses, ({ one, many }) => ({
    owner: one(users, {
        fields: [businesses.ownerId],
        references: [users.id],
    }),
    locations: many(locations),
}));

export const businessInsertSchema = createInsertSchema(businesses, {
    name: z
        .string()
        .min(3, "Business name must be at least 3 characters long")
        .max(255, "Business name must be at most 255 characters long"),
    industry: z.string().max(255, "Industry must be at most 255 characters long").optional(),
});

// Locations table
export const locations = createTable("location", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    businessId: varchar("businessId", { length: 255 })
        .notNull()
        .references(() => businesses.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const locationsRelations = relations(locations, ({ one, many }) => ({
    business: one(businesses, {
        fields: [locations.businessId],
        references: [businesses.id],
    }),
    customers: many(customers),
    qrCodes: many(qrCodes),
    automations: many(automations),
}));

export const locationInsertSchema = createInsertSchema(locations, {
    name: z
        .string()
        .min(3, "Location name must be at least 3 characters long")
        .max(255, "Location name must be at most 255 characters long"),
    address: z.string().max(1000, "Address must be at most 1000 characters long").optional(),
});

// Customers table
export const customers = createTable("customer", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    locationId: varchar("locationId", { length: 255 })
        .notNull()
        .references(() => locations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 255 }),
    source: customerSourceEnum("source").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
    location: one(locations, {
        fields: [customers.locationId],
        references: [locations.id],
    }),
    messages: many(messages),
}));

export const customerInsertSchema = createInsertSchema(customers, {
    name: z.string().max(255, "Name must be at most 255 characters long").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().max(255, "Phone must be at most 255 characters long").optional(),
});

// QR Codes table
export const qrCodes = createTable("qr_code", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    locationId: varchar("locationId", { length: 255 })
        .notNull()
        .references(() => locations.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 255 }).notNull(),
    formFields: jsonb("formFields").notNull(),
    destinationUrl: text("destinationUrl"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
    location: one(locations, {
        fields: [qrCodes.locationId],
        references: [locations.id],
    }),
}));

export const qrCodeInsertSchema = createInsertSchema(qrCodes, {
    label: z
        .string()
        .min(3, "Label must be at least 3 characters long")
        .max(255, "Label must be at most 255 characters long"),
    formFields: z.object({}).passthrough(),
    destinationUrl: z.string().url("Invalid URL").optional(),
});

// Automations table
export const automations = createTable("automation", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    locationId: varchar("locationId", { length: 255 })
        .notNull()
        .references(() => locations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    trigger: varchar("trigger", { length: 255 }).notNull(),
    steps: jsonb("steps").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const automationsRelations = relations(automations, ({ one }) => ({
    location: one(locations, {
        fields: [automations.locationId],
        references: [locations.id],
    }),
}));

export const automationInsertSchema = createInsertSchema(automations, {
    name: z
        .string()
        .min(3, "Automation name must be at least 3 characters long")
        .max(255, "Automation name must be at most 255 characters long"),
    trigger: z.string().min(1, "Trigger is required"),
    steps: z.array(z.object({}).passthrough()),
});

// Messages table
export const messages = createTable("message", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    customerId: varchar("customerId", { length: 255 })
        .notNull()
        .references(() => customers.id, { onDelete: "cascade" }),
    type: messageTypeEnum("type").notNull(),
    content: text("content").notNull(),
    status: messageStatusEnum("status").default("pending").notNull(),
    provider: messageProviderEnum("provider").notNull(),
    timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
    customer: one(customers, {
        fields: [messages.customerId],
        references: [customers.id],
    }),
}));

export const messageInsertSchema = createInsertSchema(messages, {
    content: z.string().min(1, "Message content is required"),
});
