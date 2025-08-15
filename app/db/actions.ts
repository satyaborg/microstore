/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// FIXME: add proper types

import { db } from "@/app/db";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

/**
 * A generic type representing any table in the Drizzle ORM schema.
 */
type AnyTable = PgTable;

/**
 * Infers the insert type from a Drizzle table.
 */
type InsertShape<T extends AnyTable> = T["$inferInsert"];

/**
 * Infers the select type (the shape of the data returned from the DB) from a Drizzle table.
 */
type SelectShape<T extends AnyTable> = T["$inferSelect"];

/**
 * Creates a set of typesafe CRUD actions for a given Drizzle table.
 *
 * @param table The Drizzle table schema to create actions for.
 * @returns An object containing `create`, `read`, `update`, `delete`, and `upsert` functions.
 */
export function createDbActions<T extends AnyTable>(table: T) {
  return {
    /**
     * Creates a new record in the table.
     * @param data The data for the new record.
     * @returns The newly created record.
     */
    create: async (data: InsertShape<T>): Promise<SelectShape<T>> => {
      const result = await db.insert(table).values(data).returning();
      if (result.length === 0) {
        throw new Error("Failed to create record");
      }
      return result[0];
    },

    /**
     * Reads records from the table, with an optional filter, limit, and column exclusions.
     * Automatically excludes soft-deleted records (where deletedAt is not null).
     * @param where An optional object to filter the records.
     * @param limit An optional number to limit the number of records returned.
     * @param excludeColumns An optional array of column names to exclude from the select.
     * @param orderBy An optional order direction ('asc' or 'desc'). Defaults to 'desc'.
     * @param orderByColumn An optional column name to order by. Defaults to 'updatedAt' if it exists, otherwise 'id'.
     * @returns An array of records matching the filter.
     */
    read: async (
      where?: Partial<SelectShape<T>>,
      limit?: number,
      excludeColumns?: (keyof SelectShape<T>)[],
      orderBy: "asc" | "desc" = "desc",
      orderByColumn?: keyof SelectShape<T>
    ): Promise<SelectShape<T>[]> => {
      let query;

      if (excludeColumns && excludeColumns.length > 0) {
        // Create a select object excluding specified columns
        const allColumns = Object.keys(table).filter(
          (key) =>
            typeof table[key as keyof T] === "object" &&
            table[key as keyof T] !== null &&
            "name" in (table[key as keyof T] as any)
        );
        const selectColumns = allColumns.reduce((acc, key) => {
          if (!excludeColumns.includes(key as keyof SelectShape<T>)) {
            // @ts-ignore - Dynamic column selection
            acc[key] = table[key];
          }
          return acc;
        }, {} as any);

        query = db.select(selectColumns).from(table as any);
      } else {
        query = db.select().from(table as any);
      }

      // Build where conditions
      const conditions = [];

      // Always exclude soft-deleted records if the table has a deletedAt column
      if ("deletedAt" in table) {
        // @ts-ignore - Dynamic column access
        conditions.push(isNull(table.deletedAt));
      }

      // Add user-provided where conditions
      if (where && Object.keys(where).length > 0) {
        const userConditions = Object.entries(where)
          .filter(([_, value]) => value !== null && value !== undefined)
          .map(([key, value]) =>
            // @ts-ignore - We are dynamically creating the where clause
            eq(table[key as keyof T], value)
          );
        conditions.push(...userConditions);
      }

      if (conditions.length > 0) {
        // @ts-ignore - Drizzle's type for where is complex, but this works
        query = query.where(and(...conditions));
      }

      // Determine the column to order by
      let orderColumn;
      if (orderByColumn && orderByColumn in table) {
        orderColumn = table[orderByColumn as keyof T];
      } else if ("updatedAt" in table) {
        orderColumn = table.updatedAt as any;
      } else if ("id" in table) {
        orderColumn = table.id as any;
      }

      if (orderColumn) {
        query =
          orderBy === "desc"
            ? query.orderBy(desc(orderColumn))
            : query.orderBy(orderColumn);
      }

      if (limit) {
        // @ts-ignore - The query object is chainable
        query = query.limit(limit);
      }

      return await query;
    },

    /**
     * Updates a record in the table.
     * Only updates non-deleted records.
     * @param id The ID of the record to update.
     * @param data The data to update the record with.
     * @returns The updated record.
     */
    update: async (
      id: string,
      data: Partial<InsertShape<T>>
    ): Promise<SelectShape<T>> => {
      // Build where conditions to include non-deleted filter
      const conditions = [
        // @ts-ignore - Assuming the table has an 'id' column, which is standard.
        eq(table.id, id),
      ];

      // Add soft-delete filter if the table supports it
      if ("deletedAt" in table) {
        // @ts-ignore - Dynamic column access
        conditions.push(isNull(table.deletedAt));
      }

      const result = await db
        .update(table)
        .set(data)
        .where(and(...conditions))
        .returning();
      if (result.length === 0) {
        throw new Error(`Record with id ${id} not found or is deleted`);
      }
      return result[0];
    },

    /**
     * Performs a soft delete on a record by setting deletedAt to the current timestamp.
     * If the table doesn't have a deletedAt column, performs a hard delete.
     * @param id The ID of the record to delete.
     * @returns The deleted record.
     */
    delete: async (id: string): Promise<SelectShape<T>> => {
      if ("deletedAt" in table) {
        // Soft delete - set deletedAt to current timestamp
        const result = await db
          .update(table)
          .set({
            // @ts-ignore - Dynamic column setting
            deletedAt: new Date(),
          } as any)
          // @ts-ignore - Assuming the table has an 'id' column.
          .where(
            and(
              eq((table as any).id, id),
              // @ts-ignore - Dynamic column access
              isNull((table as any).deletedAt)
            )
          )
          .returning();
        if (result.length === 0) {
          throw new Error(`Record with id ${id} not found or already deleted`);
        }
        return result[0];
      } else {
        // Hard delete - remove from database
        const result = await db
          .delete(table)
          // @ts-ignore - Assuming the table has an 'id' column.
          .where(eq(table.id, id))
          .returning();
        if (result.length === 0) {
          throw new Error(`Record with id ${id} not found`);
        }
        return result[0];
      }
    },

    /**
     * Inserts a new record or updates it if a conflict on the 'id' column occurs.
     * @param data The data for the record to upsert.
     * @returns The created or updated record.
     */
    upsert: async (data: InsertShape<T>): Promise<SelectShape<T>> => {
      const result = await db
        .insert(table)
        .values(data)
        .onConflictDoUpdate({
          // @ts-ignore - Assuming 'id' is the primary key for the conflict target.
          target: table.id,
          set: data,
        })
        .returning();
      if (result.length === 0) {
        throw new Error("Failed to upsert record");
      }
      return result[0];
    },
  };
}

// --- Schema Actions ---

import {
  addresses,
  analytics,
  categories,
  customers,
  discounts,
  inventory,
  orderItems,
  orders,
  products,
  storeSettings,
  stores,
} from "./schema";

// Create actions for all schema tables
export const storeActions = {
  ...createDbActions(stores),
  // Custom method for reading active stores by user
  readByUser: async (
    userId: string,
    limit?: number
  ): Promise<(typeof stores.$inferSelect)[]> => {
    const conditions = [
      eq(stores.userId, userId),
      eq(stores.isActive, true),
      isNull(stores.deletedAt),
    ];

    let query = db
      .select()
      .from(stores)
      .where(and(...conditions))
      .orderBy(desc(stores.updatedAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  },
  // Custom method for finding store by slug or domain
  findBySlugOrDomain: async (
    identifier: string
  ): Promise<typeof stores.$inferSelect | null> => {
    const result = await db
      .select()
      .from(stores)
      .where(
        and(
          or(
            eq(stores.slug, identifier),
            eq(stores.domain, identifier),
            eq(stores.subdomain, identifier)
          ),
          eq(stores.isActive, true),
          isNull(stores.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  },
};

export const categoryActions = {
  ...createDbActions(categories),
  // Custom method for reading categories by store
  readByStore: async (
    storeId: string,
    includeInactive?: boolean
  ): Promise<(typeof categories.$inferSelect)[]> => {
    const conditions = [
      eq(categories.storeId, storeId),
      isNull(categories.deletedAt),
    ];

    if (!includeInactive) {
      conditions.push(eq(categories.isActive, true));
    }

    return await db
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(categories.sortOrder, categories.name);
  },
};

export const productActions = {
  ...createDbActions(products),
  // Custom method for reading products by store
  readByStore: async (
    storeId: string,
    options?: {
      categoryId?: string;
      status?: string;
      isActive?: boolean;
      isFeatured?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<(typeof products.$inferSelect)[]> => {
    const conditions = [
      eq(products.storeId, storeId),
      isNull(products.deletedAt),
    ];

    if (options?.categoryId) {
      conditions.push(eq(products.categoryId, options.categoryId));
    }
    if (options?.status) {
      conditions.push(eq(products.status, options.status));
    }
    if (options?.isActive !== undefined) {
      conditions.push(eq(products.isActive, options.isActive));
    }
    if (options?.isFeatured !== undefined) {
      conditions.push(eq(products.isFeatured, options.isFeatured));
    }

    let query = db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(products.sortOrder, desc(products.createdAt));

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return await query;
  },
  // Custom method for searching products
  searchProducts: async (
    storeId: string,
    searchTerm: string,
    limit?: number
  ): Promise<(typeof products.$inferSelect)[]> => {
    const conditions = [
      eq(products.storeId, storeId),
      eq(products.isActive, true),
      eq(products.status, "active"),
      isNull(products.deletedAt),
    ];

    let query = db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  },
};

export const customerActions = {
  ...createDbActions(customers),
  // Custom method for reading customers by store
  readByStore: async (
    storeId: string,
    limit?: number
  ): Promise<(typeof customers.$inferSelect)[]> => {
    const conditions = [
      eq(customers.storeId, storeId),
      isNull(customers.deletedAt),
    ];

    let query = db
      .select()
      .from(customers)
      .where(and(...conditions))
      .orderBy(desc(customers.createdAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  },
  // Custom method for finding customer by email
  findByEmail: async (
    storeId: string,
    email: string
  ): Promise<typeof customers.$inferSelect | null> => {
    const result = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.storeId, storeId),
          eq(customers.email, email),
          isNull(customers.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  },
};

export const orderActions = {
  ...createDbActions(orders),
  // Custom method for reading orders by store
  readByStore: async (
    storeId: string,
    options?: {
      status?: string;
      customerId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<(typeof orders.$inferSelect)[]> => {
    const conditions = [eq(orders.storeId, storeId)];

    if (options?.status) {
      conditions.push(eq(orders.status, options.status));
    }
    if (options?.customerId) {
      conditions.push(eq(orders.customerId, options.customerId));
    }

    let query = db
      .select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt));

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return await query;
  },
  // Custom method for finding order by order number
  findByOrderNumber: async (
    orderNumber: string
  ): Promise<typeof orders.$inferSelect | null> => {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    return result[0] || null;
  },
};

export const orderItemActions = {
  ...createDbActions(orderItems),
  // Custom method for reading order items by order
  readByOrder: async (
    orderId: string
  ): Promise<(typeof orderItems.$inferSelect)[]> => {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .orderBy(orderItems.createdAt);
  },
};

export const addressActions = {
  ...createDbActions(addresses),
  // Custom method for reading addresses by customer
  readByCustomer: async (
    customerId: string,
    type?: string
  ): Promise<(typeof addresses.$inferSelect)[]> => {
    const conditions = [eq(addresses.customerId, customerId)];

    if (type) {
      conditions.push(eq(addresses.type, type));
    }

    return await db
      .select()
      .from(addresses)
      .where(and(...conditions))
      .orderBy(desc(addresses.isDefault), addresses.createdAt);
  },
};

export const inventoryActions = {
  ...createDbActions(inventory),
  // Custom method for reading inventory by product
  readByProduct: async (
    productId: string,
    variantId?: string
  ): Promise<typeof inventory.$inferSelect | null> => {
    const conditions = [eq(inventory.productId, productId)];

    if (variantId) {
      conditions.push(eq(inventory.variantId, variantId));
    }

    const result = await db
      .select()
      .from(inventory)
      .where(and(...conditions))
      .limit(1);

    return result[0] || null;
  },
  // Custom method for updating inventory quantities
  updateQuantities: async (
    productId: string,
    quantities: {
      quantity?: number;
      reservedQuantity?: number;
      availableQuantity?: number;
    },
    variantId?: string
  ): Promise<typeof inventory.$inferSelect> => {
    const conditions = [eq(inventory.productId, productId)];

    if (variantId) {
      conditions.push(eq(inventory.variantId, variantId));
    }

    const result = await db
      .update(inventory)
      .set({
        ...quantities,
        updatedAt: new Date(),
      })
      .where(and(...conditions))
      .returning();

    if (result.length === 0) {
      throw new Error(`Inventory record not found`);
    }
    return result[0];
  },
};

export const discountActions = {
  ...createDbActions(discounts),
  // Custom method for reading active discounts by store
  readActiveByStore: async (
    storeId: string
  ): Promise<(typeof discounts.$inferSelect)[]> => {
    const now = new Date();
    const conditions = [
      eq(discounts.storeId, storeId),
      eq(discounts.isActive, true),
      isNull(discounts.deletedAt),
    ];

    return await db
      .select()
      .from(discounts)
      .where(and(...conditions))
      .orderBy(discounts.createdAt);
  },
  // Custom method for finding discount by code
  findByCode: async (
    storeId: string,
    code: string
  ): Promise<typeof discounts.$inferSelect | null> => {
    const result = await db
      .select()
      .from(discounts)
      .where(
        and(
          eq(discounts.storeId, storeId),
          eq(discounts.code, code),
          eq(discounts.isActive, true),
          isNull(discounts.deletedAt)
        )
      )
      .limit(1);

    return result[0] || null;
  },
};

export const analyticsActions = {
  ...createDbActions(analytics),
  // Custom method for reading analytics by store and date range
  readByStoreAndDateRange: async (
    storeId: string,
    startDate: Date,
    endDate: Date,
    type?: string
  ): Promise<(typeof analytics.$inferSelect)[]> => {
    const conditions = [eq(analytics.storeId, storeId)];

    if (type) {
      conditions.push(eq(analytics.type, type));
    }

    return await db
      .select()
      .from(analytics)
      .where(and(...conditions))
      .orderBy(analytics.date);
  },
};

export const storeSettingsActions = {
  ...createDbActions(storeSettings),
  // Custom method for reading settings by store and category
  readByStoreAndCategory: async (
    storeId: string,
    category?: string
  ): Promise<(typeof storeSettings.$inferSelect)[]> => {
    const conditions = [eq(storeSettings.storeId, storeId)];

    if (category) {
      conditions.push(eq(storeSettings.category, category));
    }

    return await db
      .select()
      .from(storeSettings)
      .where(and(...conditions))
      .orderBy(storeSettings.category, storeSettings.key);
  },
  // Custom method for getting a specific setting value
  getSetting: async (
    storeId: string,
    category: string,
    key: string
  ): Promise<any> => {
    const result = await db
      .select()
      .from(storeSettings)
      .where(
        and(
          eq(storeSettings.storeId, storeId),
          eq(storeSettings.category, category),
          eq(storeSettings.key, key)
        )
      )
      .limit(1);

    return result[0]?.value || null;
  },
  // Custom method for setting a specific setting value
  setSetting: async (
    storeId: string,
    category: string,
    key: string,
    value: any,
    isPublic: boolean = false
  ): Promise<typeof storeSettings.$inferSelect> => {
    const result = await db
      .insert(storeSettings)
      .values({
        storeId,
        category,
        key,
        value,
        isPublic,
      })
      .onConflictDoUpdate({
        target: [
          storeSettings.storeId,
          storeSettings.category,
          storeSettings.key,
        ],
        set: {
          value,
          isPublic,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  },
};
