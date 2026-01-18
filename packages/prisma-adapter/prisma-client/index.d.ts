
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ContentType
 * 
 */
export type ContentType = $Result.DefaultSelection<Prisma.$ContentTypePayload>
/**
 * Model ContentEntry
 * 
 */
export type ContentEntry = $Result.DefaultSelection<Prisma.$ContentEntryPayload>
/**
 * Model ContentVersion
 * 
 */
export type ContentVersion = $Result.DefaultSelection<Prisma.$ContentVersionPayload>
/**
 * Model ContentLock
 * 
 */
export type ContentLock = $Result.DefaultSelection<Prisma.$ContentLockPayload>
/**
 * Model SlugRedirect
 * 
 */
export type SlugRedirect = $Result.DefaultSelection<Prisma.$SlugRedirectPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model UserRole
 * 
 */
export type UserRole = $Result.DefaultSelection<Prisma.$UserRolePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ContentTypes
 * const contentTypes = await prisma.contentType.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ContentTypes
   * const contentTypes = await prisma.contentType.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.contentType`: Exposes CRUD operations for the **ContentType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContentTypes
    * const contentTypes = await prisma.contentType.findMany()
    * ```
    */
  get contentType(): Prisma.ContentTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contentEntry`: Exposes CRUD operations for the **ContentEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContentEntries
    * const contentEntries = await prisma.contentEntry.findMany()
    * ```
    */
  get contentEntry(): Prisma.ContentEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contentVersion`: Exposes CRUD operations for the **ContentVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContentVersions
    * const contentVersions = await prisma.contentVersion.findMany()
    * ```
    */
  get contentVersion(): Prisma.ContentVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contentLock`: Exposes CRUD operations for the **ContentLock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContentLocks
    * const contentLocks = await prisma.contentLock.findMany()
    * ```
    */
  get contentLock(): Prisma.ContentLockDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.slugRedirect`: Exposes CRUD operations for the **SlugRedirect** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SlugRedirects
    * const slugRedirects = await prisma.slugRedirect.findMany()
    * ```
    */
  get slugRedirect(): Prisma.SlugRedirectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userRole`: Exposes CRUD operations for the **UserRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserRoles
    * const userRoles = await prisma.userRole.findMany()
    * ```
    */
  get userRole(): Prisma.UserRoleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ContentType: 'ContentType',
    ContentEntry: 'ContentEntry',
    ContentVersion: 'ContentVersion',
    ContentLock: 'ContentLock',
    SlugRedirect: 'SlugRedirect',
    Role: 'Role',
    UserRole: 'UserRole'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "contentType" | "contentEntry" | "contentVersion" | "contentLock" | "slugRedirect" | "role" | "userRole"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ContentType: {
        payload: Prisma.$ContentTypePayload<ExtArgs>
        fields: Prisma.ContentTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>
          }
          findFirst: {
            args: Prisma.ContentTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>
          }
          findMany: {
            args: Prisma.ContentTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>[]
          }
          create: {
            args: Prisma.ContentTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>
          }
          createMany: {
            args: Prisma.ContentTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>[]
          }
          delete: {
            args: Prisma.ContentTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>
          }
          update: {
            args: Prisma.ContentTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>
          }
          deleteMany: {
            args: Prisma.ContentTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>[]
          }
          upsert: {
            args: Prisma.ContentTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentTypePayload>
          }
          aggregate: {
            args: Prisma.ContentTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContentType>
          }
          groupBy: {
            args: Prisma.ContentTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentTypeCountArgs<ExtArgs>
            result: $Utils.Optional<ContentTypeCountAggregateOutputType> | number
          }
        }
      }
      ContentEntry: {
        payload: Prisma.$ContentEntryPayload<ExtArgs>
        fields: Prisma.ContentEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>
          }
          findFirst: {
            args: Prisma.ContentEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>
          }
          findMany: {
            args: Prisma.ContentEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>[]
          }
          create: {
            args: Prisma.ContentEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>
          }
          createMany: {
            args: Prisma.ContentEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>[]
          }
          delete: {
            args: Prisma.ContentEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>
          }
          update: {
            args: Prisma.ContentEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>
          }
          deleteMany: {
            args: Prisma.ContentEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>[]
          }
          upsert: {
            args: Prisma.ContentEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentEntryPayload>
          }
          aggregate: {
            args: Prisma.ContentEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContentEntry>
          }
          groupBy: {
            args: Prisma.ContentEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentEntryCountArgs<ExtArgs>
            result: $Utils.Optional<ContentEntryCountAggregateOutputType> | number
          }
        }
      }
      ContentVersion: {
        payload: Prisma.$ContentVersionPayload<ExtArgs>
        fields: Prisma.ContentVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>
          }
          findFirst: {
            args: Prisma.ContentVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>
          }
          findMany: {
            args: Prisma.ContentVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>[]
          }
          create: {
            args: Prisma.ContentVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>
          }
          createMany: {
            args: Prisma.ContentVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>[]
          }
          delete: {
            args: Prisma.ContentVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>
          }
          update: {
            args: Prisma.ContentVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>
          }
          deleteMany: {
            args: Prisma.ContentVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>[]
          }
          upsert: {
            args: Prisma.ContentVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentVersionPayload>
          }
          aggregate: {
            args: Prisma.ContentVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContentVersion>
          }
          groupBy: {
            args: Prisma.ContentVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ContentVersionCountAggregateOutputType> | number
          }
        }
      }
      ContentLock: {
        payload: Prisma.$ContentLockPayload<ExtArgs>
        fields: Prisma.ContentLockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContentLockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContentLockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>
          }
          findFirst: {
            args: Prisma.ContentLockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContentLockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>
          }
          findMany: {
            args: Prisma.ContentLockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>[]
          }
          create: {
            args: Prisma.ContentLockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>
          }
          createMany: {
            args: Prisma.ContentLockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContentLockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>[]
          }
          delete: {
            args: Prisma.ContentLockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>
          }
          update: {
            args: Prisma.ContentLockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>
          }
          deleteMany: {
            args: Prisma.ContentLockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContentLockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContentLockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>[]
          }
          upsert: {
            args: Prisma.ContentLockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContentLockPayload>
          }
          aggregate: {
            args: Prisma.ContentLockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContentLock>
          }
          groupBy: {
            args: Prisma.ContentLockGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContentLockGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContentLockCountArgs<ExtArgs>
            result: $Utils.Optional<ContentLockCountAggregateOutputType> | number
          }
        }
      }
      SlugRedirect: {
        payload: Prisma.$SlugRedirectPayload<ExtArgs>
        fields: Prisma.SlugRedirectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SlugRedirectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SlugRedirectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>
          }
          findFirst: {
            args: Prisma.SlugRedirectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SlugRedirectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>
          }
          findMany: {
            args: Prisma.SlugRedirectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>[]
          }
          create: {
            args: Prisma.SlugRedirectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>
          }
          createMany: {
            args: Prisma.SlugRedirectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SlugRedirectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>[]
          }
          delete: {
            args: Prisma.SlugRedirectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>
          }
          update: {
            args: Prisma.SlugRedirectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>
          }
          deleteMany: {
            args: Prisma.SlugRedirectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SlugRedirectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SlugRedirectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>[]
          }
          upsert: {
            args: Prisma.SlugRedirectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlugRedirectPayload>
          }
          aggregate: {
            args: Prisma.SlugRedirectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSlugRedirect>
          }
          groupBy: {
            args: Prisma.SlugRedirectGroupByArgs<ExtArgs>
            result: $Utils.Optional<SlugRedirectGroupByOutputType>[]
          }
          count: {
            args: Prisma.SlugRedirectCountArgs<ExtArgs>
            result: $Utils.Optional<SlugRedirectCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      UserRole: {
        payload: Prisma.$UserRolePayload<ExtArgs>
        fields: Prisma.UserRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          findFirst: {
            args: Prisma.UserRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          findMany: {
            args: Prisma.UserRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          create: {
            args: Prisma.UserRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          createMany: {
            args: Prisma.UserRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          delete: {
            args: Prisma.UserRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          update: {
            args: Prisma.UserRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          deleteMany: {
            args: Prisma.UserRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserRoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          upsert: {
            args: Prisma.UserRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          aggregate: {
            args: Prisma.UserRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserRole>
          }
          groupBy: {
            args: Prisma.UserRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserRoleCountArgs<ExtArgs>
            result: $Utils.Optional<UserRoleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    contentType?: ContentTypeOmit
    contentEntry?: ContentEntryOmit
    contentVersion?: ContentVersionOmit
    contentLock?: ContentLockOmit
    slugRedirect?: SlugRedirectOmit
    role?: RoleOmit
    userRole?: UserRoleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ContentTypeCountOutputType
   */

  export type ContentTypeCountOutputType = {
    entries: number
    redirects: number
  }

  export type ContentTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | ContentTypeCountOutputTypeCountEntriesArgs
    redirects?: boolean | ContentTypeCountOutputTypeCountRedirectsArgs
  }

  // Custom InputTypes
  /**
   * ContentTypeCountOutputType without action
   */
  export type ContentTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentTypeCountOutputType
     */
    select?: ContentTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContentTypeCountOutputType without action
   */
  export type ContentTypeCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentEntryWhereInput
  }

  /**
   * ContentTypeCountOutputType without action
   */
  export type ContentTypeCountOutputTypeCountRedirectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SlugRedirectWhereInput
  }


  /**
   * Count Type ContentEntryCountOutputType
   */

  export type ContentEntryCountOutputType = {
    versions: number
    redirects: number
  }

  export type ContentEntryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | ContentEntryCountOutputTypeCountVersionsArgs
    redirects?: boolean | ContentEntryCountOutputTypeCountRedirectsArgs
  }

  // Custom InputTypes
  /**
   * ContentEntryCountOutputType without action
   */
  export type ContentEntryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntryCountOutputType
     */
    select?: ContentEntryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContentEntryCountOutputType without action
   */
  export type ContentEntryCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentVersionWhereInput
  }

  /**
   * ContentEntryCountOutputType without action
   */
  export type ContentEntryCountOutputTypeCountRedirectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SlugRedirectWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    users: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | RoleCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ContentType
   */

  export type AggregateContentType = {
    _count: ContentTypeCountAggregateOutputType | null
    _avg: ContentTypeAvgAggregateOutputType | null
    _sum: ContentTypeSumAggregateOutputType | null
    _min: ContentTypeMinAggregateOutputType | null
    _max: ContentTypeMaxAggregateOutputType | null
  }

  export type ContentTypeAvgAggregateOutputType = {
    version: number | null
  }

  export type ContentTypeSumAggregateOutputType = {
    version: number | null
  }

  export type ContentTypeMinAggregateOutputType = {
    id: string | null
    name: string | null
    displayName: string | null
    description: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContentTypeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    displayName: string | null
    description: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContentTypeCountAggregateOutputType = {
    id: number
    name: number
    displayName: number
    description: number
    version: number
    schema: number
    localization: number
    seo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContentTypeAvgAggregateInputType = {
    version?: true
  }

  export type ContentTypeSumAggregateInputType = {
    version?: true
  }

  export type ContentTypeMinAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    description?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContentTypeMaxAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    description?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContentTypeCountAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    description?: true
    version?: true
    schema?: true
    localization?: true
    seo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContentTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentType to aggregate.
     */
    where?: ContentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTypes to fetch.
     */
    orderBy?: ContentTypeOrderByWithRelationInput | ContentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContentTypes
    **/
    _count?: true | ContentTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContentTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContentTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentTypeMaxAggregateInputType
  }

  export type GetContentTypeAggregateType<T extends ContentTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateContentType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContentType[P]>
      : GetScalarType<T[P], AggregateContentType[P]>
  }




  export type ContentTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentTypeWhereInput
    orderBy?: ContentTypeOrderByWithAggregationInput | ContentTypeOrderByWithAggregationInput[]
    by: ContentTypeScalarFieldEnum[] | ContentTypeScalarFieldEnum
    having?: ContentTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentTypeCountAggregateInputType | true
    _avg?: ContentTypeAvgAggregateInputType
    _sum?: ContentTypeSumAggregateInputType
    _min?: ContentTypeMinAggregateInputType
    _max?: ContentTypeMaxAggregateInputType
  }

  export type ContentTypeGroupByOutputType = {
    id: string
    name: string
    displayName: string
    description: string | null
    version: number
    schema: JsonValue
    localization: JsonValue
    seo: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: ContentTypeCountAggregateOutputType | null
    _avg: ContentTypeAvgAggregateOutputType | null
    _sum: ContentTypeSumAggregateOutputType | null
    _min: ContentTypeMinAggregateOutputType | null
    _max: ContentTypeMaxAggregateOutputType | null
  }

  type GetContentTypeGroupByPayload<T extends ContentTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentTypeGroupByOutputType[P]>
            : GetScalarType<T[P], ContentTypeGroupByOutputType[P]>
        }
      >
    >


  export type ContentTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    description?: boolean
    version?: boolean
    schema?: boolean
    localization?: boolean
    seo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    entries?: boolean | ContentType$entriesArgs<ExtArgs>
    redirects?: boolean | ContentType$redirectsArgs<ExtArgs>
    _count?: boolean | ContentTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentType"]>

  export type ContentTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    description?: boolean
    version?: boolean
    schema?: boolean
    localization?: boolean
    seo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["contentType"]>

  export type ContentTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    description?: boolean
    version?: boolean
    schema?: boolean
    localization?: boolean
    seo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["contentType"]>

  export type ContentTypeSelectScalar = {
    id?: boolean
    name?: boolean
    displayName?: boolean
    description?: boolean
    version?: boolean
    schema?: boolean
    localization?: boolean
    seo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContentTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "displayName" | "description" | "version" | "schema" | "localization" | "seo" | "createdAt" | "updatedAt", ExtArgs["result"]["contentType"]>
  export type ContentTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | ContentType$entriesArgs<ExtArgs>
    redirects?: boolean | ContentType$redirectsArgs<ExtArgs>
    _count?: boolean | ContentTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContentTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ContentTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContentTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContentType"
    objects: {
      entries: Prisma.$ContentEntryPayload<ExtArgs>[]
      redirects: Prisma.$SlugRedirectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      displayName: string
      description: string | null
      version: number
      schema: Prisma.JsonValue
      localization: Prisma.JsonValue
      seo: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["contentType"]>
    composites: {}
  }

  type ContentTypeGetPayload<S extends boolean | null | undefined | ContentTypeDefaultArgs> = $Result.GetResult<Prisma.$ContentTypePayload, S>

  type ContentTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentTypeCountAggregateInputType | true
    }

  export interface ContentTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContentType'], meta: { name: 'ContentType' } }
    /**
     * Find zero or one ContentType that matches the filter.
     * @param {ContentTypeFindUniqueArgs} args - Arguments to find a ContentType
     * @example
     * // Get one ContentType
     * const contentType = await prisma.contentType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentTypeFindUniqueArgs>(args: SelectSubset<T, ContentTypeFindUniqueArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContentType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentTypeFindUniqueOrThrowArgs} args - Arguments to find a ContentType
     * @example
     * // Get one ContentType
     * const contentType = await prisma.contentType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeFindFirstArgs} args - Arguments to find a ContentType
     * @example
     * // Get one ContentType
     * const contentType = await prisma.contentType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentTypeFindFirstArgs>(args?: SelectSubset<T, ContentTypeFindFirstArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeFindFirstOrThrowArgs} args - Arguments to find a ContentType
     * @example
     * // Get one ContentType
     * const contentType = await prisma.contentType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContentTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContentTypes
     * const contentTypes = await prisma.contentType.findMany()
     * 
     * // Get first 10 ContentTypes
     * const contentTypes = await prisma.contentType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contentTypeWithIdOnly = await prisma.contentType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContentTypeFindManyArgs>(args?: SelectSubset<T, ContentTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContentType.
     * @param {ContentTypeCreateArgs} args - Arguments to create a ContentType.
     * @example
     * // Create one ContentType
     * const ContentType = await prisma.contentType.create({
     *   data: {
     *     // ... data to create a ContentType
     *   }
     * })
     * 
     */
    create<T extends ContentTypeCreateArgs>(args: SelectSubset<T, ContentTypeCreateArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContentTypes.
     * @param {ContentTypeCreateManyArgs} args - Arguments to create many ContentTypes.
     * @example
     * // Create many ContentTypes
     * const contentType = await prisma.contentType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentTypeCreateManyArgs>(args?: SelectSubset<T, ContentTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContentTypes and returns the data saved in the database.
     * @param {ContentTypeCreateManyAndReturnArgs} args - Arguments to create many ContentTypes.
     * @example
     * // Create many ContentTypes
     * const contentType = await prisma.contentType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContentTypes and only return the `id`
     * const contentTypeWithIdOnly = await prisma.contentType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContentType.
     * @param {ContentTypeDeleteArgs} args - Arguments to delete one ContentType.
     * @example
     * // Delete one ContentType
     * const ContentType = await prisma.contentType.delete({
     *   where: {
     *     // ... filter to delete one ContentType
     *   }
     * })
     * 
     */
    delete<T extends ContentTypeDeleteArgs>(args: SelectSubset<T, ContentTypeDeleteArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContentType.
     * @param {ContentTypeUpdateArgs} args - Arguments to update one ContentType.
     * @example
     * // Update one ContentType
     * const contentType = await prisma.contentType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentTypeUpdateArgs>(args: SelectSubset<T, ContentTypeUpdateArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContentTypes.
     * @param {ContentTypeDeleteManyArgs} args - Arguments to filter ContentTypes to delete.
     * @example
     * // Delete a few ContentTypes
     * const { count } = await prisma.contentType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentTypeDeleteManyArgs>(args?: SelectSubset<T, ContentTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContentTypes
     * const contentType = await prisma.contentType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentTypeUpdateManyArgs>(args: SelectSubset<T, ContentTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentTypes and returns the data updated in the database.
     * @param {ContentTypeUpdateManyAndReturnArgs} args - Arguments to update many ContentTypes.
     * @example
     * // Update many ContentTypes
     * const contentType = await prisma.contentType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContentTypes and only return the `id`
     * const contentTypeWithIdOnly = await prisma.contentType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContentTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContentType.
     * @param {ContentTypeUpsertArgs} args - Arguments to update or create a ContentType.
     * @example
     * // Update or create a ContentType
     * const contentType = await prisma.contentType.upsert({
     *   create: {
     *     // ... data to create a ContentType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContentType we want to update
     *   }
     * })
     */
    upsert<T extends ContentTypeUpsertArgs>(args: SelectSubset<T, ContentTypeUpsertArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContentTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeCountArgs} args - Arguments to filter ContentTypes to count.
     * @example
     * // Count the number of ContentTypes
     * const count = await prisma.contentType.count({
     *   where: {
     *     // ... the filter for the ContentTypes we want to count
     *   }
     * })
    **/
    count<T extends ContentTypeCountArgs>(
      args?: Subset<T, ContentTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContentType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContentTypeAggregateArgs>(args: Subset<T, ContentTypeAggregateArgs>): Prisma.PrismaPromise<GetContentTypeAggregateType<T>>

    /**
     * Group by ContentType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContentTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentTypeGroupByArgs['orderBy'] }
        : { orderBy?: ContentTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContentTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContentType model
   */
  readonly fields: ContentTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContentType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entries<T extends ContentType$entriesArgs<ExtArgs> = {}>(args?: Subset<T, ContentType$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    redirects<T extends ContentType$redirectsArgs<ExtArgs> = {}>(args?: Subset<T, ContentType$redirectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContentType model
   */
  interface ContentTypeFieldRefs {
    readonly id: FieldRef<"ContentType", 'String'>
    readonly name: FieldRef<"ContentType", 'String'>
    readonly displayName: FieldRef<"ContentType", 'String'>
    readonly description: FieldRef<"ContentType", 'String'>
    readonly version: FieldRef<"ContentType", 'Int'>
    readonly schema: FieldRef<"ContentType", 'Json'>
    readonly localization: FieldRef<"ContentType", 'Json'>
    readonly seo: FieldRef<"ContentType", 'Json'>
    readonly createdAt: FieldRef<"ContentType", 'DateTime'>
    readonly updatedAt: FieldRef<"ContentType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContentType findUnique
   */
  export type ContentTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * Filter, which ContentType to fetch.
     */
    where: ContentTypeWhereUniqueInput
  }

  /**
   * ContentType findUniqueOrThrow
   */
  export type ContentTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * Filter, which ContentType to fetch.
     */
    where: ContentTypeWhereUniqueInput
  }

  /**
   * ContentType findFirst
   */
  export type ContentTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * Filter, which ContentType to fetch.
     */
    where?: ContentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTypes to fetch.
     */
    orderBy?: ContentTypeOrderByWithRelationInput | ContentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentTypes.
     */
    cursor?: ContentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentTypes.
     */
    distinct?: ContentTypeScalarFieldEnum | ContentTypeScalarFieldEnum[]
  }

  /**
   * ContentType findFirstOrThrow
   */
  export type ContentTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * Filter, which ContentType to fetch.
     */
    where?: ContentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTypes to fetch.
     */
    orderBy?: ContentTypeOrderByWithRelationInput | ContentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentTypes.
     */
    cursor?: ContentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentTypes.
     */
    distinct?: ContentTypeScalarFieldEnum | ContentTypeScalarFieldEnum[]
  }

  /**
   * ContentType findMany
   */
  export type ContentTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * Filter, which ContentTypes to fetch.
     */
    where?: ContentTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentTypes to fetch.
     */
    orderBy?: ContentTypeOrderByWithRelationInput | ContentTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContentTypes.
     */
    cursor?: ContentTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentTypes.
     */
    skip?: number
    distinct?: ContentTypeScalarFieldEnum | ContentTypeScalarFieldEnum[]
  }

  /**
   * ContentType create
   */
  export type ContentTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a ContentType.
     */
    data: XOR<ContentTypeCreateInput, ContentTypeUncheckedCreateInput>
  }

  /**
   * ContentType createMany
   */
  export type ContentTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContentTypes.
     */
    data: ContentTypeCreateManyInput | ContentTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentType createManyAndReturn
   */
  export type ContentTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * The data used to create many ContentTypes.
     */
    data: ContentTypeCreateManyInput | ContentTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentType update
   */
  export type ContentTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a ContentType.
     */
    data: XOR<ContentTypeUpdateInput, ContentTypeUncheckedUpdateInput>
    /**
     * Choose, which ContentType to update.
     */
    where: ContentTypeWhereUniqueInput
  }

  /**
   * ContentType updateMany
   */
  export type ContentTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContentTypes.
     */
    data: XOR<ContentTypeUpdateManyMutationInput, ContentTypeUncheckedUpdateManyInput>
    /**
     * Filter which ContentTypes to update
     */
    where?: ContentTypeWhereInput
    /**
     * Limit how many ContentTypes to update.
     */
    limit?: number
  }

  /**
   * ContentType updateManyAndReturn
   */
  export type ContentTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * The data used to update ContentTypes.
     */
    data: XOR<ContentTypeUpdateManyMutationInput, ContentTypeUncheckedUpdateManyInput>
    /**
     * Filter which ContentTypes to update
     */
    where?: ContentTypeWhereInput
    /**
     * Limit how many ContentTypes to update.
     */
    limit?: number
  }

  /**
   * ContentType upsert
   */
  export type ContentTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the ContentType to update in case it exists.
     */
    where: ContentTypeWhereUniqueInput
    /**
     * In case the ContentType found by the `where` argument doesn't exist, create a new ContentType with this data.
     */
    create: XOR<ContentTypeCreateInput, ContentTypeUncheckedCreateInput>
    /**
     * In case the ContentType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentTypeUpdateInput, ContentTypeUncheckedUpdateInput>
  }

  /**
   * ContentType delete
   */
  export type ContentTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
    /**
     * Filter which ContentType to delete.
     */
    where: ContentTypeWhereUniqueInput
  }

  /**
   * ContentType deleteMany
   */
  export type ContentTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentTypes to delete
     */
    where?: ContentTypeWhereInput
    /**
     * Limit how many ContentTypes to delete.
     */
    limit?: number
  }

  /**
   * ContentType.entries
   */
  export type ContentType$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    where?: ContentEntryWhereInput
    orderBy?: ContentEntryOrderByWithRelationInput | ContentEntryOrderByWithRelationInput[]
    cursor?: ContentEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContentEntryScalarFieldEnum | ContentEntryScalarFieldEnum[]
  }

  /**
   * ContentType.redirects
   */
  export type ContentType$redirectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    where?: SlugRedirectWhereInput
    orderBy?: SlugRedirectOrderByWithRelationInput | SlugRedirectOrderByWithRelationInput[]
    cursor?: SlugRedirectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SlugRedirectScalarFieldEnum | SlugRedirectScalarFieldEnum[]
  }

  /**
   * ContentType without action
   */
  export type ContentTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentType
     */
    select?: ContentTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentType
     */
    omit?: ContentTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentTypeInclude<ExtArgs> | null
  }


  /**
   * Model ContentEntry
   */

  export type AggregateContentEntry = {
    _count: ContentEntryCountAggregateOutputType | null
    _min: ContentEntryMinAggregateOutputType | null
    _max: ContentEntryMaxAggregateOutputType | null
  }

  export type ContentEntryMinAggregateOutputType = {
    id: string | null
    typeId: string | null
    defaultLocale: string | null
    createdAt: Date | null
    createdBy: string | null
    deletedAt: Date | null
  }

  export type ContentEntryMaxAggregateOutputType = {
    id: string | null
    typeId: string | null
    defaultLocale: string | null
    createdAt: Date | null
    createdBy: string | null
    deletedAt: Date | null
  }

  export type ContentEntryCountAggregateOutputType = {
    id: number
    typeId: number
    defaultLocale: number
    createdAt: number
    createdBy: number
    deletedAt: number
    _all: number
  }


  export type ContentEntryMinAggregateInputType = {
    id?: true
    typeId?: true
    defaultLocale?: true
    createdAt?: true
    createdBy?: true
    deletedAt?: true
  }

  export type ContentEntryMaxAggregateInputType = {
    id?: true
    typeId?: true
    defaultLocale?: true
    createdAt?: true
    createdBy?: true
    deletedAt?: true
  }

  export type ContentEntryCountAggregateInputType = {
    id?: true
    typeId?: true
    defaultLocale?: true
    createdAt?: true
    createdBy?: true
    deletedAt?: true
    _all?: true
  }

  export type ContentEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentEntry to aggregate.
     */
    where?: ContentEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentEntries to fetch.
     */
    orderBy?: ContentEntryOrderByWithRelationInput | ContentEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContentEntries
    **/
    _count?: true | ContentEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentEntryMaxAggregateInputType
  }

  export type GetContentEntryAggregateType<T extends ContentEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateContentEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContentEntry[P]>
      : GetScalarType<T[P], AggregateContentEntry[P]>
  }




  export type ContentEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentEntryWhereInput
    orderBy?: ContentEntryOrderByWithAggregationInput | ContentEntryOrderByWithAggregationInput[]
    by: ContentEntryScalarFieldEnum[] | ContentEntryScalarFieldEnum
    having?: ContentEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentEntryCountAggregateInputType | true
    _min?: ContentEntryMinAggregateInputType
    _max?: ContentEntryMaxAggregateInputType
  }

  export type ContentEntryGroupByOutputType = {
    id: string
    typeId: string
    defaultLocale: string
    createdAt: Date
    createdBy: string
    deletedAt: Date | null
    _count: ContentEntryCountAggregateOutputType | null
    _min: ContentEntryMinAggregateOutputType | null
    _max: ContentEntryMaxAggregateOutputType | null
  }

  type GetContentEntryGroupByPayload<T extends ContentEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentEntryGroupByOutputType[P]>
            : GetScalarType<T[P], ContentEntryGroupByOutputType[P]>
        }
      >
    >


  export type ContentEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    typeId?: boolean
    defaultLocale?: boolean
    createdAt?: boolean
    createdBy?: boolean
    deletedAt?: boolean
    type?: boolean | ContentTypeDefaultArgs<ExtArgs>
    versions?: boolean | ContentEntry$versionsArgs<ExtArgs>
    lock?: boolean | ContentEntry$lockArgs<ExtArgs>
    redirects?: boolean | ContentEntry$redirectsArgs<ExtArgs>
    _count?: boolean | ContentEntryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentEntry"]>

  export type ContentEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    typeId?: boolean
    defaultLocale?: boolean
    createdAt?: boolean
    createdBy?: boolean
    deletedAt?: boolean
    type?: boolean | ContentTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentEntry"]>

  export type ContentEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    typeId?: boolean
    defaultLocale?: boolean
    createdAt?: boolean
    createdBy?: boolean
    deletedAt?: boolean
    type?: boolean | ContentTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentEntry"]>

  export type ContentEntrySelectScalar = {
    id?: boolean
    typeId?: boolean
    defaultLocale?: boolean
    createdAt?: boolean
    createdBy?: boolean
    deletedAt?: boolean
  }

  export type ContentEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "typeId" | "defaultLocale" | "createdAt" | "createdBy" | "deletedAt", ExtArgs["result"]["contentEntry"]>
  export type ContentEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    type?: boolean | ContentTypeDefaultArgs<ExtArgs>
    versions?: boolean | ContentEntry$versionsArgs<ExtArgs>
    lock?: boolean | ContentEntry$lockArgs<ExtArgs>
    redirects?: boolean | ContentEntry$redirectsArgs<ExtArgs>
    _count?: boolean | ContentEntryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContentEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    type?: boolean | ContentTypeDefaultArgs<ExtArgs>
  }
  export type ContentEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    type?: boolean | ContentTypeDefaultArgs<ExtArgs>
  }

  export type $ContentEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContentEntry"
    objects: {
      type: Prisma.$ContentTypePayload<ExtArgs>
      versions: Prisma.$ContentVersionPayload<ExtArgs>[]
      lock: Prisma.$ContentLockPayload<ExtArgs> | null
      redirects: Prisma.$SlugRedirectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      typeId: string
      defaultLocale: string
      createdAt: Date
      createdBy: string
      deletedAt: Date | null
    }, ExtArgs["result"]["contentEntry"]>
    composites: {}
  }

  type ContentEntryGetPayload<S extends boolean | null | undefined | ContentEntryDefaultArgs> = $Result.GetResult<Prisma.$ContentEntryPayload, S>

  type ContentEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentEntryCountAggregateInputType | true
    }

  export interface ContentEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContentEntry'], meta: { name: 'ContentEntry' } }
    /**
     * Find zero or one ContentEntry that matches the filter.
     * @param {ContentEntryFindUniqueArgs} args - Arguments to find a ContentEntry
     * @example
     * // Get one ContentEntry
     * const contentEntry = await prisma.contentEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentEntryFindUniqueArgs>(args: SelectSubset<T, ContentEntryFindUniqueArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContentEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentEntryFindUniqueOrThrowArgs} args - Arguments to find a ContentEntry
     * @example
     * // Get one ContentEntry
     * const contentEntry = await prisma.contentEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryFindFirstArgs} args - Arguments to find a ContentEntry
     * @example
     * // Get one ContentEntry
     * const contentEntry = await prisma.contentEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentEntryFindFirstArgs>(args?: SelectSubset<T, ContentEntryFindFirstArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryFindFirstOrThrowArgs} args - Arguments to find a ContentEntry
     * @example
     * // Get one ContentEntry
     * const contentEntry = await prisma.contentEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContentEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContentEntries
     * const contentEntries = await prisma.contentEntry.findMany()
     * 
     * // Get first 10 ContentEntries
     * const contentEntries = await prisma.contentEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contentEntryWithIdOnly = await prisma.contentEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContentEntryFindManyArgs>(args?: SelectSubset<T, ContentEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContentEntry.
     * @param {ContentEntryCreateArgs} args - Arguments to create a ContentEntry.
     * @example
     * // Create one ContentEntry
     * const ContentEntry = await prisma.contentEntry.create({
     *   data: {
     *     // ... data to create a ContentEntry
     *   }
     * })
     * 
     */
    create<T extends ContentEntryCreateArgs>(args: SelectSubset<T, ContentEntryCreateArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContentEntries.
     * @param {ContentEntryCreateManyArgs} args - Arguments to create many ContentEntries.
     * @example
     * // Create many ContentEntries
     * const contentEntry = await prisma.contentEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentEntryCreateManyArgs>(args?: SelectSubset<T, ContentEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContentEntries and returns the data saved in the database.
     * @param {ContentEntryCreateManyAndReturnArgs} args - Arguments to create many ContentEntries.
     * @example
     * // Create many ContentEntries
     * const contentEntry = await prisma.contentEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContentEntries and only return the `id`
     * const contentEntryWithIdOnly = await prisma.contentEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContentEntry.
     * @param {ContentEntryDeleteArgs} args - Arguments to delete one ContentEntry.
     * @example
     * // Delete one ContentEntry
     * const ContentEntry = await prisma.contentEntry.delete({
     *   where: {
     *     // ... filter to delete one ContentEntry
     *   }
     * })
     * 
     */
    delete<T extends ContentEntryDeleteArgs>(args: SelectSubset<T, ContentEntryDeleteArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContentEntry.
     * @param {ContentEntryUpdateArgs} args - Arguments to update one ContentEntry.
     * @example
     * // Update one ContentEntry
     * const contentEntry = await prisma.contentEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentEntryUpdateArgs>(args: SelectSubset<T, ContentEntryUpdateArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContentEntries.
     * @param {ContentEntryDeleteManyArgs} args - Arguments to filter ContentEntries to delete.
     * @example
     * // Delete a few ContentEntries
     * const { count } = await prisma.contentEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentEntryDeleteManyArgs>(args?: SelectSubset<T, ContentEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContentEntries
     * const contentEntry = await prisma.contentEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentEntryUpdateManyArgs>(args: SelectSubset<T, ContentEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentEntries and returns the data updated in the database.
     * @param {ContentEntryUpdateManyAndReturnArgs} args - Arguments to update many ContentEntries.
     * @example
     * // Update many ContentEntries
     * const contentEntry = await prisma.contentEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContentEntries and only return the `id`
     * const contentEntryWithIdOnly = await prisma.contentEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContentEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContentEntry.
     * @param {ContentEntryUpsertArgs} args - Arguments to update or create a ContentEntry.
     * @example
     * // Update or create a ContentEntry
     * const contentEntry = await prisma.contentEntry.upsert({
     *   create: {
     *     // ... data to create a ContentEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContentEntry we want to update
     *   }
     * })
     */
    upsert<T extends ContentEntryUpsertArgs>(args: SelectSubset<T, ContentEntryUpsertArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContentEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryCountArgs} args - Arguments to filter ContentEntries to count.
     * @example
     * // Count the number of ContentEntries
     * const count = await prisma.contentEntry.count({
     *   where: {
     *     // ... the filter for the ContentEntries we want to count
     *   }
     * })
    **/
    count<T extends ContentEntryCountArgs>(
      args?: Subset<T, ContentEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContentEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContentEntryAggregateArgs>(args: Subset<T, ContentEntryAggregateArgs>): Prisma.PrismaPromise<GetContentEntryAggregateType<T>>

    /**
     * Group by ContentEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContentEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentEntryGroupByArgs['orderBy'] }
        : { orderBy?: ContentEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContentEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContentEntry model
   */
  readonly fields: ContentEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContentEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    type<T extends ContentTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentTypeDefaultArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    versions<T extends ContentEntry$versionsArgs<ExtArgs> = {}>(args?: Subset<T, ContentEntry$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    lock<T extends ContentEntry$lockArgs<ExtArgs> = {}>(args?: Subset<T, ContentEntry$lockArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    redirects<T extends ContentEntry$redirectsArgs<ExtArgs> = {}>(args?: Subset<T, ContentEntry$redirectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContentEntry model
   */
  interface ContentEntryFieldRefs {
    readonly id: FieldRef<"ContentEntry", 'String'>
    readonly typeId: FieldRef<"ContentEntry", 'String'>
    readonly defaultLocale: FieldRef<"ContentEntry", 'String'>
    readonly createdAt: FieldRef<"ContentEntry", 'DateTime'>
    readonly createdBy: FieldRef<"ContentEntry", 'String'>
    readonly deletedAt: FieldRef<"ContentEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContentEntry findUnique
   */
  export type ContentEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * Filter, which ContentEntry to fetch.
     */
    where: ContentEntryWhereUniqueInput
  }

  /**
   * ContentEntry findUniqueOrThrow
   */
  export type ContentEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * Filter, which ContentEntry to fetch.
     */
    where: ContentEntryWhereUniqueInput
  }

  /**
   * ContentEntry findFirst
   */
  export type ContentEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * Filter, which ContentEntry to fetch.
     */
    where?: ContentEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentEntries to fetch.
     */
    orderBy?: ContentEntryOrderByWithRelationInput | ContentEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentEntries.
     */
    cursor?: ContentEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentEntries.
     */
    distinct?: ContentEntryScalarFieldEnum | ContentEntryScalarFieldEnum[]
  }

  /**
   * ContentEntry findFirstOrThrow
   */
  export type ContentEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * Filter, which ContentEntry to fetch.
     */
    where?: ContentEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentEntries to fetch.
     */
    orderBy?: ContentEntryOrderByWithRelationInput | ContentEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentEntries.
     */
    cursor?: ContentEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentEntries.
     */
    distinct?: ContentEntryScalarFieldEnum | ContentEntryScalarFieldEnum[]
  }

  /**
   * ContentEntry findMany
   */
  export type ContentEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * Filter, which ContentEntries to fetch.
     */
    where?: ContentEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentEntries to fetch.
     */
    orderBy?: ContentEntryOrderByWithRelationInput | ContentEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContentEntries.
     */
    cursor?: ContentEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentEntries.
     */
    skip?: number
    distinct?: ContentEntryScalarFieldEnum | ContentEntryScalarFieldEnum[]
  }

  /**
   * ContentEntry create
   */
  export type ContentEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a ContentEntry.
     */
    data: XOR<ContentEntryCreateInput, ContentEntryUncheckedCreateInput>
  }

  /**
   * ContentEntry createMany
   */
  export type ContentEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContentEntries.
     */
    data: ContentEntryCreateManyInput | ContentEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentEntry createManyAndReturn
   */
  export type ContentEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * The data used to create many ContentEntries.
     */
    data: ContentEntryCreateManyInput | ContentEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentEntry update
   */
  export type ContentEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a ContentEntry.
     */
    data: XOR<ContentEntryUpdateInput, ContentEntryUncheckedUpdateInput>
    /**
     * Choose, which ContentEntry to update.
     */
    where: ContentEntryWhereUniqueInput
  }

  /**
   * ContentEntry updateMany
   */
  export type ContentEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContentEntries.
     */
    data: XOR<ContentEntryUpdateManyMutationInput, ContentEntryUncheckedUpdateManyInput>
    /**
     * Filter which ContentEntries to update
     */
    where?: ContentEntryWhereInput
    /**
     * Limit how many ContentEntries to update.
     */
    limit?: number
  }

  /**
   * ContentEntry updateManyAndReturn
   */
  export type ContentEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * The data used to update ContentEntries.
     */
    data: XOR<ContentEntryUpdateManyMutationInput, ContentEntryUncheckedUpdateManyInput>
    /**
     * Filter which ContentEntries to update
     */
    where?: ContentEntryWhereInput
    /**
     * Limit how many ContentEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentEntry upsert
   */
  export type ContentEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the ContentEntry to update in case it exists.
     */
    where: ContentEntryWhereUniqueInput
    /**
     * In case the ContentEntry found by the `where` argument doesn't exist, create a new ContentEntry with this data.
     */
    create: XOR<ContentEntryCreateInput, ContentEntryUncheckedCreateInput>
    /**
     * In case the ContentEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentEntryUpdateInput, ContentEntryUncheckedUpdateInput>
  }

  /**
   * ContentEntry delete
   */
  export type ContentEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
    /**
     * Filter which ContentEntry to delete.
     */
    where: ContentEntryWhereUniqueInput
  }

  /**
   * ContentEntry deleteMany
   */
  export type ContentEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentEntries to delete
     */
    where?: ContentEntryWhereInput
    /**
     * Limit how many ContentEntries to delete.
     */
    limit?: number
  }

  /**
   * ContentEntry.versions
   */
  export type ContentEntry$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    where?: ContentVersionWhereInput
    orderBy?: ContentVersionOrderByWithRelationInput | ContentVersionOrderByWithRelationInput[]
    cursor?: ContentVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContentVersionScalarFieldEnum | ContentVersionScalarFieldEnum[]
  }

  /**
   * ContentEntry.lock
   */
  export type ContentEntry$lockArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    where?: ContentLockWhereInput
  }

  /**
   * ContentEntry.redirects
   */
  export type ContentEntry$redirectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    where?: SlugRedirectWhereInput
    orderBy?: SlugRedirectOrderByWithRelationInput | SlugRedirectOrderByWithRelationInput[]
    cursor?: SlugRedirectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SlugRedirectScalarFieldEnum | SlugRedirectScalarFieldEnum[]
  }

  /**
   * ContentEntry without action
   */
  export type ContentEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentEntry
     */
    select?: ContentEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentEntry
     */
    omit?: ContentEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentEntryInclude<ExtArgs> | null
  }


  /**
   * Model ContentVersion
   */

  export type AggregateContentVersion = {
    _count: ContentVersionCountAggregateOutputType | null
    _avg: ContentVersionAvgAggregateOutputType | null
    _sum: ContentVersionSumAggregateOutputType | null
    _min: ContentVersionMinAggregateOutputType | null
    _max: ContentVersionMaxAggregateOutputType | null
  }

  export type ContentVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type ContentVersionSumAggregateOutputType = {
    version: number | null
  }

  export type ContentVersionMinAggregateOutputType = {
    id: string | null
    entryId: string | null
    version: number | null
    status: string | null
    createdAt: Date | null
    createdBy: string | null
    publishedAt: Date | null
    scheduledAt: Date | null
  }

  export type ContentVersionMaxAggregateOutputType = {
    id: string | null
    entryId: string | null
    version: number | null
    status: string | null
    createdAt: Date | null
    createdBy: string | null
    publishedAt: Date | null
    scheduledAt: Date | null
  }

  export type ContentVersionCountAggregateOutputType = {
    id: number
    entryId: number
    version: number
    status: number
    data: number
    createdAt: number
    createdBy: number
    publishedAt: number
    scheduledAt: number
    _all: number
  }


  export type ContentVersionAvgAggregateInputType = {
    version?: true
  }

  export type ContentVersionSumAggregateInputType = {
    version?: true
  }

  export type ContentVersionMinAggregateInputType = {
    id?: true
    entryId?: true
    version?: true
    status?: true
    createdAt?: true
    createdBy?: true
    publishedAt?: true
    scheduledAt?: true
  }

  export type ContentVersionMaxAggregateInputType = {
    id?: true
    entryId?: true
    version?: true
    status?: true
    createdAt?: true
    createdBy?: true
    publishedAt?: true
    scheduledAt?: true
  }

  export type ContentVersionCountAggregateInputType = {
    id?: true
    entryId?: true
    version?: true
    status?: true
    data?: true
    createdAt?: true
    createdBy?: true
    publishedAt?: true
    scheduledAt?: true
    _all?: true
  }

  export type ContentVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentVersion to aggregate.
     */
    where?: ContentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentVersions to fetch.
     */
    orderBy?: ContentVersionOrderByWithRelationInput | ContentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContentVersions
    **/
    _count?: true | ContentVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContentVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContentVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentVersionMaxAggregateInputType
  }

  export type GetContentVersionAggregateType<T extends ContentVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateContentVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContentVersion[P]>
      : GetScalarType<T[P], AggregateContentVersion[P]>
  }




  export type ContentVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentVersionWhereInput
    orderBy?: ContentVersionOrderByWithAggregationInput | ContentVersionOrderByWithAggregationInput[]
    by: ContentVersionScalarFieldEnum[] | ContentVersionScalarFieldEnum
    having?: ContentVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentVersionCountAggregateInputType | true
    _avg?: ContentVersionAvgAggregateInputType
    _sum?: ContentVersionSumAggregateInputType
    _min?: ContentVersionMinAggregateInputType
    _max?: ContentVersionMaxAggregateInputType
  }

  export type ContentVersionGroupByOutputType = {
    id: string
    entryId: string
    version: number
    status: string
    data: JsonValue
    createdAt: Date
    createdBy: string
    publishedAt: Date | null
    scheduledAt: Date | null
    _count: ContentVersionCountAggregateOutputType | null
    _avg: ContentVersionAvgAggregateOutputType | null
    _sum: ContentVersionSumAggregateOutputType | null
    _min: ContentVersionMinAggregateOutputType | null
    _max: ContentVersionMaxAggregateOutputType | null
  }

  type GetContentVersionGroupByPayload<T extends ContentVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ContentVersionGroupByOutputType[P]>
        }
      >
    >


  export type ContentVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    version?: boolean
    status?: boolean
    data?: boolean
    createdAt?: boolean
    createdBy?: boolean
    publishedAt?: boolean
    scheduledAt?: boolean
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentVersion"]>

  export type ContentVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    version?: boolean
    status?: boolean
    data?: boolean
    createdAt?: boolean
    createdBy?: boolean
    publishedAt?: boolean
    scheduledAt?: boolean
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentVersion"]>

  export type ContentVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    version?: boolean
    status?: boolean
    data?: boolean
    createdAt?: boolean
    createdBy?: boolean
    publishedAt?: boolean
    scheduledAt?: boolean
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentVersion"]>

  export type ContentVersionSelectScalar = {
    id?: boolean
    entryId?: boolean
    version?: boolean
    status?: boolean
    data?: boolean
    createdAt?: boolean
    createdBy?: boolean
    publishedAt?: boolean
    scheduledAt?: boolean
  }

  export type ContentVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "entryId" | "version" | "status" | "data" | "createdAt" | "createdBy" | "publishedAt" | "scheduledAt", ExtArgs["result"]["contentVersion"]>
  export type ContentVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }
  export type ContentVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }
  export type ContentVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }

  export type $ContentVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContentVersion"
    objects: {
      entry: Prisma.$ContentEntryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entryId: string
      version: number
      status: string
      data: Prisma.JsonValue
      createdAt: Date
      createdBy: string
      publishedAt: Date | null
      scheduledAt: Date | null
    }, ExtArgs["result"]["contentVersion"]>
    composites: {}
  }

  type ContentVersionGetPayload<S extends boolean | null | undefined | ContentVersionDefaultArgs> = $Result.GetResult<Prisma.$ContentVersionPayload, S>

  type ContentVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentVersionCountAggregateInputType | true
    }

  export interface ContentVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContentVersion'], meta: { name: 'ContentVersion' } }
    /**
     * Find zero or one ContentVersion that matches the filter.
     * @param {ContentVersionFindUniqueArgs} args - Arguments to find a ContentVersion
     * @example
     * // Get one ContentVersion
     * const contentVersion = await prisma.contentVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentVersionFindUniqueArgs>(args: SelectSubset<T, ContentVersionFindUniqueArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContentVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentVersionFindUniqueOrThrowArgs} args - Arguments to find a ContentVersion
     * @example
     * // Get one ContentVersion
     * const contentVersion = await prisma.contentVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionFindFirstArgs} args - Arguments to find a ContentVersion
     * @example
     * // Get one ContentVersion
     * const contentVersion = await prisma.contentVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentVersionFindFirstArgs>(args?: SelectSubset<T, ContentVersionFindFirstArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionFindFirstOrThrowArgs} args - Arguments to find a ContentVersion
     * @example
     * // Get one ContentVersion
     * const contentVersion = await prisma.contentVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContentVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContentVersions
     * const contentVersions = await prisma.contentVersion.findMany()
     * 
     * // Get first 10 ContentVersions
     * const contentVersions = await prisma.contentVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contentVersionWithIdOnly = await prisma.contentVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContentVersionFindManyArgs>(args?: SelectSubset<T, ContentVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContentVersion.
     * @param {ContentVersionCreateArgs} args - Arguments to create a ContentVersion.
     * @example
     * // Create one ContentVersion
     * const ContentVersion = await prisma.contentVersion.create({
     *   data: {
     *     // ... data to create a ContentVersion
     *   }
     * })
     * 
     */
    create<T extends ContentVersionCreateArgs>(args: SelectSubset<T, ContentVersionCreateArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContentVersions.
     * @param {ContentVersionCreateManyArgs} args - Arguments to create many ContentVersions.
     * @example
     * // Create many ContentVersions
     * const contentVersion = await prisma.contentVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentVersionCreateManyArgs>(args?: SelectSubset<T, ContentVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContentVersions and returns the data saved in the database.
     * @param {ContentVersionCreateManyAndReturnArgs} args - Arguments to create many ContentVersions.
     * @example
     * // Create many ContentVersions
     * const contentVersion = await prisma.contentVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContentVersions and only return the `id`
     * const contentVersionWithIdOnly = await prisma.contentVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContentVersion.
     * @param {ContentVersionDeleteArgs} args - Arguments to delete one ContentVersion.
     * @example
     * // Delete one ContentVersion
     * const ContentVersion = await prisma.contentVersion.delete({
     *   where: {
     *     // ... filter to delete one ContentVersion
     *   }
     * })
     * 
     */
    delete<T extends ContentVersionDeleteArgs>(args: SelectSubset<T, ContentVersionDeleteArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContentVersion.
     * @param {ContentVersionUpdateArgs} args - Arguments to update one ContentVersion.
     * @example
     * // Update one ContentVersion
     * const contentVersion = await prisma.contentVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentVersionUpdateArgs>(args: SelectSubset<T, ContentVersionUpdateArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContentVersions.
     * @param {ContentVersionDeleteManyArgs} args - Arguments to filter ContentVersions to delete.
     * @example
     * // Delete a few ContentVersions
     * const { count } = await prisma.contentVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentVersionDeleteManyArgs>(args?: SelectSubset<T, ContentVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContentVersions
     * const contentVersion = await prisma.contentVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentVersionUpdateManyArgs>(args: SelectSubset<T, ContentVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentVersions and returns the data updated in the database.
     * @param {ContentVersionUpdateManyAndReturnArgs} args - Arguments to update many ContentVersions.
     * @example
     * // Update many ContentVersions
     * const contentVersion = await prisma.contentVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContentVersions and only return the `id`
     * const contentVersionWithIdOnly = await prisma.contentVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContentVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContentVersion.
     * @param {ContentVersionUpsertArgs} args - Arguments to update or create a ContentVersion.
     * @example
     * // Update or create a ContentVersion
     * const contentVersion = await prisma.contentVersion.upsert({
     *   create: {
     *     // ... data to create a ContentVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContentVersion we want to update
     *   }
     * })
     */
    upsert<T extends ContentVersionUpsertArgs>(args: SelectSubset<T, ContentVersionUpsertArgs<ExtArgs>>): Prisma__ContentVersionClient<$Result.GetResult<Prisma.$ContentVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContentVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionCountArgs} args - Arguments to filter ContentVersions to count.
     * @example
     * // Count the number of ContentVersions
     * const count = await prisma.contentVersion.count({
     *   where: {
     *     // ... the filter for the ContentVersions we want to count
     *   }
     * })
    **/
    count<T extends ContentVersionCountArgs>(
      args?: Subset<T, ContentVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContentVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContentVersionAggregateArgs>(args: Subset<T, ContentVersionAggregateArgs>): Prisma.PrismaPromise<GetContentVersionAggregateType<T>>

    /**
     * Group by ContentVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContentVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentVersionGroupByArgs['orderBy'] }
        : { orderBy?: ContentVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContentVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContentVersion model
   */
  readonly fields: ContentVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContentVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entry<T extends ContentEntryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentEntryDefaultArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContentVersion model
   */
  interface ContentVersionFieldRefs {
    readonly id: FieldRef<"ContentVersion", 'String'>
    readonly entryId: FieldRef<"ContentVersion", 'String'>
    readonly version: FieldRef<"ContentVersion", 'Int'>
    readonly status: FieldRef<"ContentVersion", 'String'>
    readonly data: FieldRef<"ContentVersion", 'Json'>
    readonly createdAt: FieldRef<"ContentVersion", 'DateTime'>
    readonly createdBy: FieldRef<"ContentVersion", 'String'>
    readonly publishedAt: FieldRef<"ContentVersion", 'DateTime'>
    readonly scheduledAt: FieldRef<"ContentVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContentVersion findUnique
   */
  export type ContentVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ContentVersion to fetch.
     */
    where: ContentVersionWhereUniqueInput
  }

  /**
   * ContentVersion findUniqueOrThrow
   */
  export type ContentVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ContentVersion to fetch.
     */
    where: ContentVersionWhereUniqueInput
  }

  /**
   * ContentVersion findFirst
   */
  export type ContentVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ContentVersion to fetch.
     */
    where?: ContentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentVersions to fetch.
     */
    orderBy?: ContentVersionOrderByWithRelationInput | ContentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentVersions.
     */
    cursor?: ContentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentVersions.
     */
    distinct?: ContentVersionScalarFieldEnum | ContentVersionScalarFieldEnum[]
  }

  /**
   * ContentVersion findFirstOrThrow
   */
  export type ContentVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ContentVersion to fetch.
     */
    where?: ContentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentVersions to fetch.
     */
    orderBy?: ContentVersionOrderByWithRelationInput | ContentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentVersions.
     */
    cursor?: ContentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentVersions.
     */
    distinct?: ContentVersionScalarFieldEnum | ContentVersionScalarFieldEnum[]
  }

  /**
   * ContentVersion findMany
   */
  export type ContentVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * Filter, which ContentVersions to fetch.
     */
    where?: ContentVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentVersions to fetch.
     */
    orderBy?: ContentVersionOrderByWithRelationInput | ContentVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContentVersions.
     */
    cursor?: ContentVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentVersions.
     */
    skip?: number
    distinct?: ContentVersionScalarFieldEnum | ContentVersionScalarFieldEnum[]
  }

  /**
   * ContentVersion create
   */
  export type ContentVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ContentVersion.
     */
    data: XOR<ContentVersionCreateInput, ContentVersionUncheckedCreateInput>
  }

  /**
   * ContentVersion createMany
   */
  export type ContentVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContentVersions.
     */
    data: ContentVersionCreateManyInput | ContentVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentVersion createManyAndReturn
   */
  export type ContentVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * The data used to create many ContentVersions.
     */
    data: ContentVersionCreateManyInput | ContentVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentVersion update
   */
  export type ContentVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ContentVersion.
     */
    data: XOR<ContentVersionUpdateInput, ContentVersionUncheckedUpdateInput>
    /**
     * Choose, which ContentVersion to update.
     */
    where: ContentVersionWhereUniqueInput
  }

  /**
   * ContentVersion updateMany
   */
  export type ContentVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContentVersions.
     */
    data: XOR<ContentVersionUpdateManyMutationInput, ContentVersionUncheckedUpdateManyInput>
    /**
     * Filter which ContentVersions to update
     */
    where?: ContentVersionWhereInput
    /**
     * Limit how many ContentVersions to update.
     */
    limit?: number
  }

  /**
   * ContentVersion updateManyAndReturn
   */
  export type ContentVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * The data used to update ContentVersions.
     */
    data: XOR<ContentVersionUpdateManyMutationInput, ContentVersionUncheckedUpdateManyInput>
    /**
     * Filter which ContentVersions to update
     */
    where?: ContentVersionWhereInput
    /**
     * Limit how many ContentVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentVersion upsert
   */
  export type ContentVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ContentVersion to update in case it exists.
     */
    where: ContentVersionWhereUniqueInput
    /**
     * In case the ContentVersion found by the `where` argument doesn't exist, create a new ContentVersion with this data.
     */
    create: XOR<ContentVersionCreateInput, ContentVersionUncheckedCreateInput>
    /**
     * In case the ContentVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentVersionUpdateInput, ContentVersionUncheckedUpdateInput>
  }

  /**
   * ContentVersion delete
   */
  export type ContentVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
    /**
     * Filter which ContentVersion to delete.
     */
    where: ContentVersionWhereUniqueInput
  }

  /**
   * ContentVersion deleteMany
   */
  export type ContentVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentVersions to delete
     */
    where?: ContentVersionWhereInput
    /**
     * Limit how many ContentVersions to delete.
     */
    limit?: number
  }

  /**
   * ContentVersion without action
   */
  export type ContentVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentVersion
     */
    select?: ContentVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentVersion
     */
    omit?: ContentVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentVersionInclude<ExtArgs> | null
  }


  /**
   * Model ContentLock
   */

  export type AggregateContentLock = {
    _count: ContentLockCountAggregateOutputType | null
    _min: ContentLockMinAggregateOutputType | null
    _max: ContentLockMaxAggregateOutputType | null
  }

  export type ContentLockMinAggregateOutputType = {
    id: string | null
    entryId: string | null
    lockedBy: string | null
    lockedAt: Date | null
    expiresAt: Date | null
  }

  export type ContentLockMaxAggregateOutputType = {
    id: string | null
    entryId: string | null
    lockedBy: string | null
    lockedAt: Date | null
    expiresAt: Date | null
  }

  export type ContentLockCountAggregateOutputType = {
    id: number
    entryId: number
    lockedBy: number
    lockedAt: number
    expiresAt: number
    _all: number
  }


  export type ContentLockMinAggregateInputType = {
    id?: true
    entryId?: true
    lockedBy?: true
    lockedAt?: true
    expiresAt?: true
  }

  export type ContentLockMaxAggregateInputType = {
    id?: true
    entryId?: true
    lockedBy?: true
    lockedAt?: true
    expiresAt?: true
  }

  export type ContentLockCountAggregateInputType = {
    id?: true
    entryId?: true
    lockedBy?: true
    lockedAt?: true
    expiresAt?: true
    _all?: true
  }

  export type ContentLockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentLock to aggregate.
     */
    where?: ContentLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentLocks to fetch.
     */
    orderBy?: ContentLockOrderByWithRelationInput | ContentLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContentLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContentLocks
    **/
    _count?: true | ContentLockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContentLockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContentLockMaxAggregateInputType
  }

  export type GetContentLockAggregateType<T extends ContentLockAggregateArgs> = {
        [P in keyof T & keyof AggregateContentLock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContentLock[P]>
      : GetScalarType<T[P], AggregateContentLock[P]>
  }




  export type ContentLockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContentLockWhereInput
    orderBy?: ContentLockOrderByWithAggregationInput | ContentLockOrderByWithAggregationInput[]
    by: ContentLockScalarFieldEnum[] | ContentLockScalarFieldEnum
    having?: ContentLockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContentLockCountAggregateInputType | true
    _min?: ContentLockMinAggregateInputType
    _max?: ContentLockMaxAggregateInputType
  }

  export type ContentLockGroupByOutputType = {
    id: string
    entryId: string
    lockedBy: string
    lockedAt: Date
    expiresAt: Date
    _count: ContentLockCountAggregateOutputType | null
    _min: ContentLockMinAggregateOutputType | null
    _max: ContentLockMaxAggregateOutputType | null
  }

  type GetContentLockGroupByPayload<T extends ContentLockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContentLockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContentLockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContentLockGroupByOutputType[P]>
            : GetScalarType<T[P], ContentLockGroupByOutputType[P]>
        }
      >
    >


  export type ContentLockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    lockedBy?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentLock"]>

  export type ContentLockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    lockedBy?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentLock"]>

  export type ContentLockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entryId?: boolean
    lockedBy?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contentLock"]>

  export type ContentLockSelectScalar = {
    id?: boolean
    entryId?: boolean
    lockedBy?: boolean
    lockedAt?: boolean
    expiresAt?: boolean
  }

  export type ContentLockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "entryId" | "lockedBy" | "lockedAt" | "expiresAt", ExtArgs["result"]["contentLock"]>
  export type ContentLockInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }
  export type ContentLockIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }
  export type ContentLockIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }

  export type $ContentLockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContentLock"
    objects: {
      entry: Prisma.$ContentEntryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entryId: string
      lockedBy: string
      lockedAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["contentLock"]>
    composites: {}
  }

  type ContentLockGetPayload<S extends boolean | null | undefined | ContentLockDefaultArgs> = $Result.GetResult<Prisma.$ContentLockPayload, S>

  type ContentLockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContentLockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContentLockCountAggregateInputType | true
    }

  export interface ContentLockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContentLock'], meta: { name: 'ContentLock' } }
    /**
     * Find zero or one ContentLock that matches the filter.
     * @param {ContentLockFindUniqueArgs} args - Arguments to find a ContentLock
     * @example
     * // Get one ContentLock
     * const contentLock = await prisma.contentLock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContentLockFindUniqueArgs>(args: SelectSubset<T, ContentLockFindUniqueArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContentLock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContentLockFindUniqueOrThrowArgs} args - Arguments to find a ContentLock
     * @example
     * // Get one ContentLock
     * const contentLock = await prisma.contentLock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContentLockFindUniqueOrThrowArgs>(args: SelectSubset<T, ContentLockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentLock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockFindFirstArgs} args - Arguments to find a ContentLock
     * @example
     * // Get one ContentLock
     * const contentLock = await prisma.contentLock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContentLockFindFirstArgs>(args?: SelectSubset<T, ContentLockFindFirstArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContentLock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockFindFirstOrThrowArgs} args - Arguments to find a ContentLock
     * @example
     * // Get one ContentLock
     * const contentLock = await prisma.contentLock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContentLockFindFirstOrThrowArgs>(args?: SelectSubset<T, ContentLockFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContentLocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContentLocks
     * const contentLocks = await prisma.contentLock.findMany()
     * 
     * // Get first 10 ContentLocks
     * const contentLocks = await prisma.contentLock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contentLockWithIdOnly = await prisma.contentLock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContentLockFindManyArgs>(args?: SelectSubset<T, ContentLockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContentLock.
     * @param {ContentLockCreateArgs} args - Arguments to create a ContentLock.
     * @example
     * // Create one ContentLock
     * const ContentLock = await prisma.contentLock.create({
     *   data: {
     *     // ... data to create a ContentLock
     *   }
     * })
     * 
     */
    create<T extends ContentLockCreateArgs>(args: SelectSubset<T, ContentLockCreateArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContentLocks.
     * @param {ContentLockCreateManyArgs} args - Arguments to create many ContentLocks.
     * @example
     * // Create many ContentLocks
     * const contentLock = await prisma.contentLock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContentLockCreateManyArgs>(args?: SelectSubset<T, ContentLockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContentLocks and returns the data saved in the database.
     * @param {ContentLockCreateManyAndReturnArgs} args - Arguments to create many ContentLocks.
     * @example
     * // Create many ContentLocks
     * const contentLock = await prisma.contentLock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContentLocks and only return the `id`
     * const contentLockWithIdOnly = await prisma.contentLock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContentLockCreateManyAndReturnArgs>(args?: SelectSubset<T, ContentLockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContentLock.
     * @param {ContentLockDeleteArgs} args - Arguments to delete one ContentLock.
     * @example
     * // Delete one ContentLock
     * const ContentLock = await prisma.contentLock.delete({
     *   where: {
     *     // ... filter to delete one ContentLock
     *   }
     * })
     * 
     */
    delete<T extends ContentLockDeleteArgs>(args: SelectSubset<T, ContentLockDeleteArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContentLock.
     * @param {ContentLockUpdateArgs} args - Arguments to update one ContentLock.
     * @example
     * // Update one ContentLock
     * const contentLock = await prisma.contentLock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContentLockUpdateArgs>(args: SelectSubset<T, ContentLockUpdateArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContentLocks.
     * @param {ContentLockDeleteManyArgs} args - Arguments to filter ContentLocks to delete.
     * @example
     * // Delete a few ContentLocks
     * const { count } = await prisma.contentLock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContentLockDeleteManyArgs>(args?: SelectSubset<T, ContentLockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContentLocks
     * const contentLock = await prisma.contentLock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContentLockUpdateManyArgs>(args: SelectSubset<T, ContentLockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContentLocks and returns the data updated in the database.
     * @param {ContentLockUpdateManyAndReturnArgs} args - Arguments to update many ContentLocks.
     * @example
     * // Update many ContentLocks
     * const contentLock = await prisma.contentLock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContentLocks and only return the `id`
     * const contentLockWithIdOnly = await prisma.contentLock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContentLockUpdateManyAndReturnArgs>(args: SelectSubset<T, ContentLockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContentLock.
     * @param {ContentLockUpsertArgs} args - Arguments to update or create a ContentLock.
     * @example
     * // Update or create a ContentLock
     * const contentLock = await prisma.contentLock.upsert({
     *   create: {
     *     // ... data to create a ContentLock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContentLock we want to update
     *   }
     * })
     */
    upsert<T extends ContentLockUpsertArgs>(args: SelectSubset<T, ContentLockUpsertArgs<ExtArgs>>): Prisma__ContentLockClient<$Result.GetResult<Prisma.$ContentLockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContentLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockCountArgs} args - Arguments to filter ContentLocks to count.
     * @example
     * // Count the number of ContentLocks
     * const count = await prisma.contentLock.count({
     *   where: {
     *     // ... the filter for the ContentLocks we want to count
     *   }
     * })
    **/
    count<T extends ContentLockCountArgs>(
      args?: Subset<T, ContentLockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContentLockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContentLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContentLockAggregateArgs>(args: Subset<T, ContentLockAggregateArgs>): Prisma.PrismaPromise<GetContentLockAggregateType<T>>

    /**
     * Group by ContentLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContentLockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContentLockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContentLockGroupByArgs['orderBy'] }
        : { orderBy?: ContentLockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContentLockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContentLockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContentLock model
   */
  readonly fields: ContentLockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContentLock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContentLockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    entry<T extends ContentEntryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentEntryDefaultArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContentLock model
   */
  interface ContentLockFieldRefs {
    readonly id: FieldRef<"ContentLock", 'String'>
    readonly entryId: FieldRef<"ContentLock", 'String'>
    readonly lockedBy: FieldRef<"ContentLock", 'String'>
    readonly lockedAt: FieldRef<"ContentLock", 'DateTime'>
    readonly expiresAt: FieldRef<"ContentLock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContentLock findUnique
   */
  export type ContentLockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * Filter, which ContentLock to fetch.
     */
    where: ContentLockWhereUniqueInput
  }

  /**
   * ContentLock findUniqueOrThrow
   */
  export type ContentLockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * Filter, which ContentLock to fetch.
     */
    where: ContentLockWhereUniqueInput
  }

  /**
   * ContentLock findFirst
   */
  export type ContentLockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * Filter, which ContentLock to fetch.
     */
    where?: ContentLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentLocks to fetch.
     */
    orderBy?: ContentLockOrderByWithRelationInput | ContentLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentLocks.
     */
    cursor?: ContentLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentLocks.
     */
    distinct?: ContentLockScalarFieldEnum | ContentLockScalarFieldEnum[]
  }

  /**
   * ContentLock findFirstOrThrow
   */
  export type ContentLockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * Filter, which ContentLock to fetch.
     */
    where?: ContentLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentLocks to fetch.
     */
    orderBy?: ContentLockOrderByWithRelationInput | ContentLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContentLocks.
     */
    cursor?: ContentLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContentLocks.
     */
    distinct?: ContentLockScalarFieldEnum | ContentLockScalarFieldEnum[]
  }

  /**
   * ContentLock findMany
   */
  export type ContentLockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * Filter, which ContentLocks to fetch.
     */
    where?: ContentLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContentLocks to fetch.
     */
    orderBy?: ContentLockOrderByWithRelationInput | ContentLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContentLocks.
     */
    cursor?: ContentLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContentLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContentLocks.
     */
    skip?: number
    distinct?: ContentLockScalarFieldEnum | ContentLockScalarFieldEnum[]
  }

  /**
   * ContentLock create
   */
  export type ContentLockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * The data needed to create a ContentLock.
     */
    data: XOR<ContentLockCreateInput, ContentLockUncheckedCreateInput>
  }

  /**
   * ContentLock createMany
   */
  export type ContentLockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContentLocks.
     */
    data: ContentLockCreateManyInput | ContentLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContentLock createManyAndReturn
   */
  export type ContentLockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * The data used to create many ContentLocks.
     */
    data: ContentLockCreateManyInput | ContentLockCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentLock update
   */
  export type ContentLockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * The data needed to update a ContentLock.
     */
    data: XOR<ContentLockUpdateInput, ContentLockUncheckedUpdateInput>
    /**
     * Choose, which ContentLock to update.
     */
    where: ContentLockWhereUniqueInput
  }

  /**
   * ContentLock updateMany
   */
  export type ContentLockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContentLocks.
     */
    data: XOR<ContentLockUpdateManyMutationInput, ContentLockUncheckedUpdateManyInput>
    /**
     * Filter which ContentLocks to update
     */
    where?: ContentLockWhereInput
    /**
     * Limit how many ContentLocks to update.
     */
    limit?: number
  }

  /**
   * ContentLock updateManyAndReturn
   */
  export type ContentLockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * The data used to update ContentLocks.
     */
    data: XOR<ContentLockUpdateManyMutationInput, ContentLockUncheckedUpdateManyInput>
    /**
     * Filter which ContentLocks to update
     */
    where?: ContentLockWhereInput
    /**
     * Limit how many ContentLocks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContentLock upsert
   */
  export type ContentLockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * The filter to search for the ContentLock to update in case it exists.
     */
    where: ContentLockWhereUniqueInput
    /**
     * In case the ContentLock found by the `where` argument doesn't exist, create a new ContentLock with this data.
     */
    create: XOR<ContentLockCreateInput, ContentLockUncheckedCreateInput>
    /**
     * In case the ContentLock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContentLockUpdateInput, ContentLockUncheckedUpdateInput>
  }

  /**
   * ContentLock delete
   */
  export type ContentLockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
    /**
     * Filter which ContentLock to delete.
     */
    where: ContentLockWhereUniqueInput
  }

  /**
   * ContentLock deleteMany
   */
  export type ContentLockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContentLocks to delete
     */
    where?: ContentLockWhereInput
    /**
     * Limit how many ContentLocks to delete.
     */
    limit?: number
  }

  /**
   * ContentLock without action
   */
  export type ContentLockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContentLock
     */
    select?: ContentLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContentLock
     */
    omit?: ContentLockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContentLockInclude<ExtArgs> | null
  }


  /**
   * Model SlugRedirect
   */

  export type AggregateSlugRedirect = {
    _count: SlugRedirectCountAggregateOutputType | null
    _min: SlugRedirectMinAggregateOutputType | null
    _max: SlugRedirectMaxAggregateOutputType | null
  }

  export type SlugRedirectMinAggregateOutputType = {
    id: string | null
    contentTypeId: string | null
    locale: string | null
    fromSlug: string | null
    toEntryId: string | null
    createdAt: Date | null
  }

  export type SlugRedirectMaxAggregateOutputType = {
    id: string | null
    contentTypeId: string | null
    locale: string | null
    fromSlug: string | null
    toEntryId: string | null
    createdAt: Date | null
  }

  export type SlugRedirectCountAggregateOutputType = {
    id: number
    contentTypeId: number
    locale: number
    fromSlug: number
    toEntryId: number
    createdAt: number
    _all: number
  }


  export type SlugRedirectMinAggregateInputType = {
    id?: true
    contentTypeId?: true
    locale?: true
    fromSlug?: true
    toEntryId?: true
    createdAt?: true
  }

  export type SlugRedirectMaxAggregateInputType = {
    id?: true
    contentTypeId?: true
    locale?: true
    fromSlug?: true
    toEntryId?: true
    createdAt?: true
  }

  export type SlugRedirectCountAggregateInputType = {
    id?: true
    contentTypeId?: true
    locale?: true
    fromSlug?: true
    toEntryId?: true
    createdAt?: true
    _all?: true
  }

  export type SlugRedirectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SlugRedirect to aggregate.
     */
    where?: SlugRedirectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SlugRedirects to fetch.
     */
    orderBy?: SlugRedirectOrderByWithRelationInput | SlugRedirectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SlugRedirectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SlugRedirects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SlugRedirects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SlugRedirects
    **/
    _count?: true | SlugRedirectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SlugRedirectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SlugRedirectMaxAggregateInputType
  }

  export type GetSlugRedirectAggregateType<T extends SlugRedirectAggregateArgs> = {
        [P in keyof T & keyof AggregateSlugRedirect]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSlugRedirect[P]>
      : GetScalarType<T[P], AggregateSlugRedirect[P]>
  }




  export type SlugRedirectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SlugRedirectWhereInput
    orderBy?: SlugRedirectOrderByWithAggregationInput | SlugRedirectOrderByWithAggregationInput[]
    by: SlugRedirectScalarFieldEnum[] | SlugRedirectScalarFieldEnum
    having?: SlugRedirectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SlugRedirectCountAggregateInputType | true
    _min?: SlugRedirectMinAggregateInputType
    _max?: SlugRedirectMaxAggregateInputType
  }

  export type SlugRedirectGroupByOutputType = {
    id: string
    contentTypeId: string
    locale: string
    fromSlug: string
    toEntryId: string
    createdAt: Date
    _count: SlugRedirectCountAggregateOutputType | null
    _min: SlugRedirectMinAggregateOutputType | null
    _max: SlugRedirectMaxAggregateOutputType | null
  }

  type GetSlugRedirectGroupByPayload<T extends SlugRedirectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SlugRedirectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SlugRedirectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SlugRedirectGroupByOutputType[P]>
            : GetScalarType<T[P], SlugRedirectGroupByOutputType[P]>
        }
      >
    >


  export type SlugRedirectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contentTypeId?: boolean
    locale?: boolean
    fromSlug?: boolean
    toEntryId?: boolean
    createdAt?: boolean
    contentType?: boolean | ContentTypeDefaultArgs<ExtArgs>
    toEntry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["slugRedirect"]>

  export type SlugRedirectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contentTypeId?: boolean
    locale?: boolean
    fromSlug?: boolean
    toEntryId?: boolean
    createdAt?: boolean
    contentType?: boolean | ContentTypeDefaultArgs<ExtArgs>
    toEntry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["slugRedirect"]>

  export type SlugRedirectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contentTypeId?: boolean
    locale?: boolean
    fromSlug?: boolean
    toEntryId?: boolean
    createdAt?: boolean
    contentType?: boolean | ContentTypeDefaultArgs<ExtArgs>
    toEntry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["slugRedirect"]>

  export type SlugRedirectSelectScalar = {
    id?: boolean
    contentTypeId?: boolean
    locale?: boolean
    fromSlug?: boolean
    toEntryId?: boolean
    createdAt?: boolean
  }

  export type SlugRedirectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contentTypeId" | "locale" | "fromSlug" | "toEntryId" | "createdAt", ExtArgs["result"]["slugRedirect"]>
  export type SlugRedirectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contentType?: boolean | ContentTypeDefaultArgs<ExtArgs>
    toEntry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }
  export type SlugRedirectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contentType?: boolean | ContentTypeDefaultArgs<ExtArgs>
    toEntry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }
  export type SlugRedirectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contentType?: boolean | ContentTypeDefaultArgs<ExtArgs>
    toEntry?: boolean | ContentEntryDefaultArgs<ExtArgs>
  }

  export type $SlugRedirectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SlugRedirect"
    objects: {
      contentType: Prisma.$ContentTypePayload<ExtArgs>
      toEntry: Prisma.$ContentEntryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contentTypeId: string
      locale: string
      fromSlug: string
      toEntryId: string
      createdAt: Date
    }, ExtArgs["result"]["slugRedirect"]>
    composites: {}
  }

  type SlugRedirectGetPayload<S extends boolean | null | undefined | SlugRedirectDefaultArgs> = $Result.GetResult<Prisma.$SlugRedirectPayload, S>

  type SlugRedirectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SlugRedirectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SlugRedirectCountAggregateInputType | true
    }

  export interface SlugRedirectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SlugRedirect'], meta: { name: 'SlugRedirect' } }
    /**
     * Find zero or one SlugRedirect that matches the filter.
     * @param {SlugRedirectFindUniqueArgs} args - Arguments to find a SlugRedirect
     * @example
     * // Get one SlugRedirect
     * const slugRedirect = await prisma.slugRedirect.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SlugRedirectFindUniqueArgs>(args: SelectSubset<T, SlugRedirectFindUniqueArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SlugRedirect that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SlugRedirectFindUniqueOrThrowArgs} args - Arguments to find a SlugRedirect
     * @example
     * // Get one SlugRedirect
     * const slugRedirect = await prisma.slugRedirect.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SlugRedirectFindUniqueOrThrowArgs>(args: SelectSubset<T, SlugRedirectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SlugRedirect that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectFindFirstArgs} args - Arguments to find a SlugRedirect
     * @example
     * // Get one SlugRedirect
     * const slugRedirect = await prisma.slugRedirect.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SlugRedirectFindFirstArgs>(args?: SelectSubset<T, SlugRedirectFindFirstArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SlugRedirect that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectFindFirstOrThrowArgs} args - Arguments to find a SlugRedirect
     * @example
     * // Get one SlugRedirect
     * const slugRedirect = await prisma.slugRedirect.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SlugRedirectFindFirstOrThrowArgs>(args?: SelectSubset<T, SlugRedirectFindFirstOrThrowArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SlugRedirects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SlugRedirects
     * const slugRedirects = await prisma.slugRedirect.findMany()
     * 
     * // Get first 10 SlugRedirects
     * const slugRedirects = await prisma.slugRedirect.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const slugRedirectWithIdOnly = await prisma.slugRedirect.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SlugRedirectFindManyArgs>(args?: SelectSubset<T, SlugRedirectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SlugRedirect.
     * @param {SlugRedirectCreateArgs} args - Arguments to create a SlugRedirect.
     * @example
     * // Create one SlugRedirect
     * const SlugRedirect = await prisma.slugRedirect.create({
     *   data: {
     *     // ... data to create a SlugRedirect
     *   }
     * })
     * 
     */
    create<T extends SlugRedirectCreateArgs>(args: SelectSubset<T, SlugRedirectCreateArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SlugRedirects.
     * @param {SlugRedirectCreateManyArgs} args - Arguments to create many SlugRedirects.
     * @example
     * // Create many SlugRedirects
     * const slugRedirect = await prisma.slugRedirect.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SlugRedirectCreateManyArgs>(args?: SelectSubset<T, SlugRedirectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SlugRedirects and returns the data saved in the database.
     * @param {SlugRedirectCreateManyAndReturnArgs} args - Arguments to create many SlugRedirects.
     * @example
     * // Create many SlugRedirects
     * const slugRedirect = await prisma.slugRedirect.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SlugRedirects and only return the `id`
     * const slugRedirectWithIdOnly = await prisma.slugRedirect.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SlugRedirectCreateManyAndReturnArgs>(args?: SelectSubset<T, SlugRedirectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SlugRedirect.
     * @param {SlugRedirectDeleteArgs} args - Arguments to delete one SlugRedirect.
     * @example
     * // Delete one SlugRedirect
     * const SlugRedirect = await prisma.slugRedirect.delete({
     *   where: {
     *     // ... filter to delete one SlugRedirect
     *   }
     * })
     * 
     */
    delete<T extends SlugRedirectDeleteArgs>(args: SelectSubset<T, SlugRedirectDeleteArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SlugRedirect.
     * @param {SlugRedirectUpdateArgs} args - Arguments to update one SlugRedirect.
     * @example
     * // Update one SlugRedirect
     * const slugRedirect = await prisma.slugRedirect.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SlugRedirectUpdateArgs>(args: SelectSubset<T, SlugRedirectUpdateArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SlugRedirects.
     * @param {SlugRedirectDeleteManyArgs} args - Arguments to filter SlugRedirects to delete.
     * @example
     * // Delete a few SlugRedirects
     * const { count } = await prisma.slugRedirect.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SlugRedirectDeleteManyArgs>(args?: SelectSubset<T, SlugRedirectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SlugRedirects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SlugRedirects
     * const slugRedirect = await prisma.slugRedirect.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SlugRedirectUpdateManyArgs>(args: SelectSubset<T, SlugRedirectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SlugRedirects and returns the data updated in the database.
     * @param {SlugRedirectUpdateManyAndReturnArgs} args - Arguments to update many SlugRedirects.
     * @example
     * // Update many SlugRedirects
     * const slugRedirect = await prisma.slugRedirect.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SlugRedirects and only return the `id`
     * const slugRedirectWithIdOnly = await prisma.slugRedirect.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SlugRedirectUpdateManyAndReturnArgs>(args: SelectSubset<T, SlugRedirectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SlugRedirect.
     * @param {SlugRedirectUpsertArgs} args - Arguments to update or create a SlugRedirect.
     * @example
     * // Update or create a SlugRedirect
     * const slugRedirect = await prisma.slugRedirect.upsert({
     *   create: {
     *     // ... data to create a SlugRedirect
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SlugRedirect we want to update
     *   }
     * })
     */
    upsert<T extends SlugRedirectUpsertArgs>(args: SelectSubset<T, SlugRedirectUpsertArgs<ExtArgs>>): Prisma__SlugRedirectClient<$Result.GetResult<Prisma.$SlugRedirectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SlugRedirects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectCountArgs} args - Arguments to filter SlugRedirects to count.
     * @example
     * // Count the number of SlugRedirects
     * const count = await prisma.slugRedirect.count({
     *   where: {
     *     // ... the filter for the SlugRedirects we want to count
     *   }
     * })
    **/
    count<T extends SlugRedirectCountArgs>(
      args?: Subset<T, SlugRedirectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SlugRedirectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SlugRedirect.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SlugRedirectAggregateArgs>(args: Subset<T, SlugRedirectAggregateArgs>): Prisma.PrismaPromise<GetSlugRedirectAggregateType<T>>

    /**
     * Group by SlugRedirect.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlugRedirectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SlugRedirectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SlugRedirectGroupByArgs['orderBy'] }
        : { orderBy?: SlugRedirectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SlugRedirectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSlugRedirectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SlugRedirect model
   */
  readonly fields: SlugRedirectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SlugRedirect.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SlugRedirectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contentType<T extends ContentTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentTypeDefaultArgs<ExtArgs>>): Prisma__ContentTypeClient<$Result.GetResult<Prisma.$ContentTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    toEntry<T extends ContentEntryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContentEntryDefaultArgs<ExtArgs>>): Prisma__ContentEntryClient<$Result.GetResult<Prisma.$ContentEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SlugRedirect model
   */
  interface SlugRedirectFieldRefs {
    readonly id: FieldRef<"SlugRedirect", 'String'>
    readonly contentTypeId: FieldRef<"SlugRedirect", 'String'>
    readonly locale: FieldRef<"SlugRedirect", 'String'>
    readonly fromSlug: FieldRef<"SlugRedirect", 'String'>
    readonly toEntryId: FieldRef<"SlugRedirect", 'String'>
    readonly createdAt: FieldRef<"SlugRedirect", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SlugRedirect findUnique
   */
  export type SlugRedirectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * Filter, which SlugRedirect to fetch.
     */
    where: SlugRedirectWhereUniqueInput
  }

  /**
   * SlugRedirect findUniqueOrThrow
   */
  export type SlugRedirectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * Filter, which SlugRedirect to fetch.
     */
    where: SlugRedirectWhereUniqueInput
  }

  /**
   * SlugRedirect findFirst
   */
  export type SlugRedirectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * Filter, which SlugRedirect to fetch.
     */
    where?: SlugRedirectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SlugRedirects to fetch.
     */
    orderBy?: SlugRedirectOrderByWithRelationInput | SlugRedirectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SlugRedirects.
     */
    cursor?: SlugRedirectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SlugRedirects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SlugRedirects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SlugRedirects.
     */
    distinct?: SlugRedirectScalarFieldEnum | SlugRedirectScalarFieldEnum[]
  }

  /**
   * SlugRedirect findFirstOrThrow
   */
  export type SlugRedirectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * Filter, which SlugRedirect to fetch.
     */
    where?: SlugRedirectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SlugRedirects to fetch.
     */
    orderBy?: SlugRedirectOrderByWithRelationInput | SlugRedirectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SlugRedirects.
     */
    cursor?: SlugRedirectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SlugRedirects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SlugRedirects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SlugRedirects.
     */
    distinct?: SlugRedirectScalarFieldEnum | SlugRedirectScalarFieldEnum[]
  }

  /**
   * SlugRedirect findMany
   */
  export type SlugRedirectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * Filter, which SlugRedirects to fetch.
     */
    where?: SlugRedirectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SlugRedirects to fetch.
     */
    orderBy?: SlugRedirectOrderByWithRelationInput | SlugRedirectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SlugRedirects.
     */
    cursor?: SlugRedirectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SlugRedirects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SlugRedirects.
     */
    skip?: number
    distinct?: SlugRedirectScalarFieldEnum | SlugRedirectScalarFieldEnum[]
  }

  /**
   * SlugRedirect create
   */
  export type SlugRedirectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * The data needed to create a SlugRedirect.
     */
    data: XOR<SlugRedirectCreateInput, SlugRedirectUncheckedCreateInput>
  }

  /**
   * SlugRedirect createMany
   */
  export type SlugRedirectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SlugRedirects.
     */
    data: SlugRedirectCreateManyInput | SlugRedirectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SlugRedirect createManyAndReturn
   */
  export type SlugRedirectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * The data used to create many SlugRedirects.
     */
    data: SlugRedirectCreateManyInput | SlugRedirectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SlugRedirect update
   */
  export type SlugRedirectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * The data needed to update a SlugRedirect.
     */
    data: XOR<SlugRedirectUpdateInput, SlugRedirectUncheckedUpdateInput>
    /**
     * Choose, which SlugRedirect to update.
     */
    where: SlugRedirectWhereUniqueInput
  }

  /**
   * SlugRedirect updateMany
   */
  export type SlugRedirectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SlugRedirects.
     */
    data: XOR<SlugRedirectUpdateManyMutationInput, SlugRedirectUncheckedUpdateManyInput>
    /**
     * Filter which SlugRedirects to update
     */
    where?: SlugRedirectWhereInput
    /**
     * Limit how many SlugRedirects to update.
     */
    limit?: number
  }

  /**
   * SlugRedirect updateManyAndReturn
   */
  export type SlugRedirectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * The data used to update SlugRedirects.
     */
    data: XOR<SlugRedirectUpdateManyMutationInput, SlugRedirectUncheckedUpdateManyInput>
    /**
     * Filter which SlugRedirects to update
     */
    where?: SlugRedirectWhereInput
    /**
     * Limit how many SlugRedirects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SlugRedirect upsert
   */
  export type SlugRedirectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * The filter to search for the SlugRedirect to update in case it exists.
     */
    where: SlugRedirectWhereUniqueInput
    /**
     * In case the SlugRedirect found by the `where` argument doesn't exist, create a new SlugRedirect with this data.
     */
    create: XOR<SlugRedirectCreateInput, SlugRedirectUncheckedCreateInput>
    /**
     * In case the SlugRedirect was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SlugRedirectUpdateInput, SlugRedirectUncheckedUpdateInput>
  }

  /**
   * SlugRedirect delete
   */
  export type SlugRedirectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
    /**
     * Filter which SlugRedirect to delete.
     */
    where: SlugRedirectWhereUniqueInput
  }

  /**
   * SlugRedirect deleteMany
   */
  export type SlugRedirectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SlugRedirects to delete
     */
    where?: SlugRedirectWhereInput
    /**
     * Limit how many SlugRedirects to delete.
     */
    limit?: number
  }

  /**
   * SlugRedirect without action
   */
  export type SlugRedirectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SlugRedirect
     */
    select?: SlugRedirectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SlugRedirect
     */
    omit?: SlugRedirectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlugRedirectInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    displayName: number
    permissions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    permissions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    displayName: string
    permissions: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Role$usersArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    displayName?: boolean
    permissions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "displayName" | "permissions" | "createdAt" | "updatedAt", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Role$usersArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      users: Prisma.$UserRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      displayName: string
      permissions: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Role$usersArgs<ExtArgs> = {}>(args?: Subset<T, Role$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
    readonly displayName: FieldRef<"Role", 'String'>
    readonly permissions: FieldRef<"Role", 'Json'>
    readonly createdAt: FieldRef<"Role", 'DateTime'>
    readonly updatedAt: FieldRef<"Role", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.users
   */
  export type Role$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    cursor?: UserRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model UserRole
   */

  export type AggregateUserRole = {
    _count: UserRoleCountAggregateOutputType | null
    _min: UserRoleMinAggregateOutputType | null
    _max: UserRoleMaxAggregateOutputType | null
  }

  export type UserRoleMinAggregateOutputType = {
    userId: string | null
    roleId: string | null
    assignedAt: Date | null
    assignedBy: string | null
  }

  export type UserRoleMaxAggregateOutputType = {
    userId: string | null
    roleId: string | null
    assignedAt: Date | null
    assignedBy: string | null
  }

  export type UserRoleCountAggregateOutputType = {
    userId: number
    roleId: number
    assignedAt: number
    assignedBy: number
    _all: number
  }


  export type UserRoleMinAggregateInputType = {
    userId?: true
    roleId?: true
    assignedAt?: true
    assignedBy?: true
  }

  export type UserRoleMaxAggregateInputType = {
    userId?: true
    roleId?: true
    assignedAt?: true
    assignedBy?: true
  }

  export type UserRoleCountAggregateInputType = {
    userId?: true
    roleId?: true
    assignedAt?: true
    assignedBy?: true
    _all?: true
  }

  export type UserRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRole to aggregate.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserRoles
    **/
    _count?: true | UserRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserRoleMaxAggregateInputType
  }

  export type GetUserRoleAggregateType<T extends UserRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateUserRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserRole[P]>
      : GetScalarType<T[P], AggregateUserRole[P]>
  }




  export type UserRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithAggregationInput | UserRoleOrderByWithAggregationInput[]
    by: UserRoleScalarFieldEnum[] | UserRoleScalarFieldEnum
    having?: UserRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserRoleCountAggregateInputType | true
    _min?: UserRoleMinAggregateInputType
    _max?: UserRoleMaxAggregateInputType
  }

  export type UserRoleGroupByOutputType = {
    userId: string
    roleId: string
    assignedAt: Date
    assignedBy: string
    _count: UserRoleCountAggregateOutputType | null
    _min: UserRoleMinAggregateOutputType | null
    _max: UserRoleMaxAggregateOutputType | null
  }

  type GetUserRoleGroupByPayload<T extends UserRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserRoleGroupByOutputType[P]>
            : GetScalarType<T[P], UserRoleGroupByOutputType[P]>
        }
      >
    >


  export type UserRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    roleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    roleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    roleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectScalar = {
    userId?: boolean
    roleId?: boolean
    assignedAt?: boolean
    assignedBy?: boolean
  }

  export type UserRoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "roleId" | "assignedAt" | "assignedBy", ExtArgs["result"]["userRole"]>
  export type UserRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserRoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $UserRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserRole"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      roleId: string
      assignedAt: Date
      assignedBy: string
    }, ExtArgs["result"]["userRole"]>
    composites: {}
  }

  type UserRoleGetPayload<S extends boolean | null | undefined | UserRoleDefaultArgs> = $Result.GetResult<Prisma.$UserRolePayload, S>

  type UserRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserRoleCountAggregateInputType | true
    }

  export interface UserRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserRole'], meta: { name: 'UserRole' } }
    /**
     * Find zero or one UserRole that matches the filter.
     * @param {UserRoleFindUniqueArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserRoleFindUniqueArgs>(args: SelectSubset<T, UserRoleFindUniqueArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserRole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserRoleFindUniqueOrThrowArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, UserRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindFirstArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserRoleFindFirstArgs>(args?: SelectSubset<T, UserRoleFindFirstArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindFirstOrThrowArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, UserRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserRoles
     * const userRoles = await prisma.userRole.findMany()
     * 
     * // Get first 10 UserRoles
     * const userRoles = await prisma.userRole.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userRoleWithUserIdOnly = await prisma.userRole.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserRoleFindManyArgs>(args?: SelectSubset<T, UserRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserRole.
     * @param {UserRoleCreateArgs} args - Arguments to create a UserRole.
     * @example
     * // Create one UserRole
     * const UserRole = await prisma.userRole.create({
     *   data: {
     *     // ... data to create a UserRole
     *   }
     * })
     * 
     */
    create<T extends UserRoleCreateArgs>(args: SelectSubset<T, UserRoleCreateArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserRoles.
     * @param {UserRoleCreateManyArgs} args - Arguments to create many UserRoles.
     * @example
     * // Create many UserRoles
     * const userRole = await prisma.userRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserRoleCreateManyArgs>(args?: SelectSubset<T, UserRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserRoles and returns the data saved in the database.
     * @param {UserRoleCreateManyAndReturnArgs} args - Arguments to create many UserRoles.
     * @example
     * // Create many UserRoles
     * const userRole = await prisma.userRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserRoles and only return the `userId`
     * const userRoleWithUserIdOnly = await prisma.userRole.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, UserRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserRole.
     * @param {UserRoleDeleteArgs} args - Arguments to delete one UserRole.
     * @example
     * // Delete one UserRole
     * const UserRole = await prisma.userRole.delete({
     *   where: {
     *     // ... filter to delete one UserRole
     *   }
     * })
     * 
     */
    delete<T extends UserRoleDeleteArgs>(args: SelectSubset<T, UserRoleDeleteArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserRole.
     * @param {UserRoleUpdateArgs} args - Arguments to update one UserRole.
     * @example
     * // Update one UserRole
     * const userRole = await prisma.userRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserRoleUpdateArgs>(args: SelectSubset<T, UserRoleUpdateArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserRoles.
     * @param {UserRoleDeleteManyArgs} args - Arguments to filter UserRoles to delete.
     * @example
     * // Delete a few UserRoles
     * const { count } = await prisma.userRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserRoleDeleteManyArgs>(args?: SelectSubset<T, UserRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserRoles
     * const userRole = await prisma.userRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserRoleUpdateManyArgs>(args: SelectSubset<T, UserRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRoles and returns the data updated in the database.
     * @param {UserRoleUpdateManyAndReturnArgs} args - Arguments to update many UserRoles.
     * @example
     * // Update many UserRoles
     * const userRole = await prisma.userRole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserRoles and only return the `userId`
     * const userRoleWithUserIdOnly = await prisma.userRole.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserRoleUpdateManyAndReturnArgs>(args: SelectSubset<T, UserRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserRole.
     * @param {UserRoleUpsertArgs} args - Arguments to update or create a UserRole.
     * @example
     * // Update or create a UserRole
     * const userRole = await prisma.userRole.upsert({
     *   create: {
     *     // ... data to create a UserRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserRole we want to update
     *   }
     * })
     */
    upsert<T extends UserRoleUpsertArgs>(args: SelectSubset<T, UserRoleUpsertArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleCountArgs} args - Arguments to filter UserRoles to count.
     * @example
     * // Count the number of UserRoles
     * const count = await prisma.userRole.count({
     *   where: {
     *     // ... the filter for the UserRoles we want to count
     *   }
     * })
    **/
    count<T extends UserRoleCountArgs>(
      args?: Subset<T, UserRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserRoleAggregateArgs>(args: Subset<T, UserRoleAggregateArgs>): Prisma.PrismaPromise<GetUserRoleAggregateType<T>>

    /**
     * Group by UserRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserRoleGroupByArgs['orderBy'] }
        : { orderBy?: UserRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserRole model
   */
  readonly fields: UserRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserRole model
   */
  interface UserRoleFieldRefs {
    readonly userId: FieldRef<"UserRole", 'String'>
    readonly roleId: FieldRef<"UserRole", 'String'>
    readonly assignedAt: FieldRef<"UserRole", 'DateTime'>
    readonly assignedBy: FieldRef<"UserRole", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserRole findUnique
   */
  export type UserRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole findUniqueOrThrow
   */
  export type UserRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole findFirst
   */
  export type UserRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRoles.
     */
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole findFirstOrThrow
   */
  export type UserRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRoles.
     */
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole findMany
   */
  export type UserRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRoles to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole create
   */
  export type UserRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a UserRole.
     */
    data: XOR<UserRoleCreateInput, UserRoleUncheckedCreateInput>
  }

  /**
   * UserRole createMany
   */
  export type UserRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserRoles.
     */
    data: UserRoleCreateManyInput | UserRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserRole createManyAndReturn
   */
  export type UserRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * The data used to create many UserRoles.
     */
    data: UserRoleCreateManyInput | UserRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRole update
   */
  export type UserRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a UserRole.
     */
    data: XOR<UserRoleUpdateInput, UserRoleUncheckedUpdateInput>
    /**
     * Choose, which UserRole to update.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole updateMany
   */
  export type UserRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserRoles.
     */
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyInput>
    /**
     * Filter which UserRoles to update
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to update.
     */
    limit?: number
  }

  /**
   * UserRole updateManyAndReturn
   */
  export type UserRoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * The data used to update UserRoles.
     */
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyInput>
    /**
     * Filter which UserRoles to update
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRole upsert
   */
  export type UserRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the UserRole to update in case it exists.
     */
    where: UserRoleWhereUniqueInput
    /**
     * In case the UserRole found by the `where` argument doesn't exist, create a new UserRole with this data.
     */
    create: XOR<UserRoleCreateInput, UserRoleUncheckedCreateInput>
    /**
     * In case the UserRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserRoleUpdateInput, UserRoleUncheckedUpdateInput>
  }

  /**
   * UserRole delete
   */
  export type UserRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter which UserRole to delete.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole deleteMany
   */
  export type UserRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRoles to delete
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to delete.
     */
    limit?: number
  }

  /**
   * UserRole without action
   */
  export type UserRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ContentTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    displayName: 'displayName',
    description: 'description',
    version: 'version',
    schema: 'schema',
    localization: 'localization',
    seo: 'seo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContentTypeScalarFieldEnum = (typeof ContentTypeScalarFieldEnum)[keyof typeof ContentTypeScalarFieldEnum]


  export const ContentEntryScalarFieldEnum: {
    id: 'id',
    typeId: 'typeId',
    defaultLocale: 'defaultLocale',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    deletedAt: 'deletedAt'
  };

  export type ContentEntryScalarFieldEnum = (typeof ContentEntryScalarFieldEnum)[keyof typeof ContentEntryScalarFieldEnum]


  export const ContentVersionScalarFieldEnum: {
    id: 'id',
    entryId: 'entryId',
    version: 'version',
    status: 'status',
    data: 'data',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    publishedAt: 'publishedAt',
    scheduledAt: 'scheduledAt'
  };

  export type ContentVersionScalarFieldEnum = (typeof ContentVersionScalarFieldEnum)[keyof typeof ContentVersionScalarFieldEnum]


  export const ContentLockScalarFieldEnum: {
    id: 'id',
    entryId: 'entryId',
    lockedBy: 'lockedBy',
    lockedAt: 'lockedAt',
    expiresAt: 'expiresAt'
  };

  export type ContentLockScalarFieldEnum = (typeof ContentLockScalarFieldEnum)[keyof typeof ContentLockScalarFieldEnum]


  export const SlugRedirectScalarFieldEnum: {
    id: 'id',
    contentTypeId: 'contentTypeId',
    locale: 'locale',
    fromSlug: 'fromSlug',
    toEntryId: 'toEntryId',
    createdAt: 'createdAt'
  };

  export type SlugRedirectScalarFieldEnum = (typeof SlugRedirectScalarFieldEnum)[keyof typeof SlugRedirectScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    displayName: 'displayName',
    permissions: 'permissions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const UserRoleScalarFieldEnum: {
    userId: 'userId',
    roleId: 'roleId',
    assignedAt: 'assignedAt',
    assignedBy: 'assignedBy'
  };

  export type UserRoleScalarFieldEnum = (typeof UserRoleScalarFieldEnum)[keyof typeof UserRoleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ContentTypeWhereInput = {
    AND?: ContentTypeWhereInput | ContentTypeWhereInput[]
    OR?: ContentTypeWhereInput[]
    NOT?: ContentTypeWhereInput | ContentTypeWhereInput[]
    id?: StringFilter<"ContentType"> | string
    name?: StringFilter<"ContentType"> | string
    displayName?: StringFilter<"ContentType"> | string
    description?: StringNullableFilter<"ContentType"> | string | null
    version?: IntFilter<"ContentType"> | number
    schema?: JsonFilter<"ContentType">
    localization?: JsonFilter<"ContentType">
    seo?: JsonFilter<"ContentType">
    createdAt?: DateTimeFilter<"ContentType"> | Date | string
    updatedAt?: DateTimeFilter<"ContentType"> | Date | string
    entries?: ContentEntryListRelationFilter
    redirects?: SlugRedirectListRelationFilter
  }

  export type ContentTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    description?: SortOrderInput | SortOrder
    version?: SortOrder
    schema?: SortOrder
    localization?: SortOrder
    seo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    entries?: ContentEntryOrderByRelationAggregateInput
    redirects?: SlugRedirectOrderByRelationAggregateInput
  }

  export type ContentTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ContentTypeWhereInput | ContentTypeWhereInput[]
    OR?: ContentTypeWhereInput[]
    NOT?: ContentTypeWhereInput | ContentTypeWhereInput[]
    displayName?: StringFilter<"ContentType"> | string
    description?: StringNullableFilter<"ContentType"> | string | null
    version?: IntFilter<"ContentType"> | number
    schema?: JsonFilter<"ContentType">
    localization?: JsonFilter<"ContentType">
    seo?: JsonFilter<"ContentType">
    createdAt?: DateTimeFilter<"ContentType"> | Date | string
    updatedAt?: DateTimeFilter<"ContentType"> | Date | string
    entries?: ContentEntryListRelationFilter
    redirects?: SlugRedirectListRelationFilter
  }, "id" | "name">

  export type ContentTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    description?: SortOrderInput | SortOrder
    version?: SortOrder
    schema?: SortOrder
    localization?: SortOrder
    seo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContentTypeCountOrderByAggregateInput
    _avg?: ContentTypeAvgOrderByAggregateInput
    _max?: ContentTypeMaxOrderByAggregateInput
    _min?: ContentTypeMinOrderByAggregateInput
    _sum?: ContentTypeSumOrderByAggregateInput
  }

  export type ContentTypeScalarWhereWithAggregatesInput = {
    AND?: ContentTypeScalarWhereWithAggregatesInput | ContentTypeScalarWhereWithAggregatesInput[]
    OR?: ContentTypeScalarWhereWithAggregatesInput[]
    NOT?: ContentTypeScalarWhereWithAggregatesInput | ContentTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContentType"> | string
    name?: StringWithAggregatesFilter<"ContentType"> | string
    displayName?: StringWithAggregatesFilter<"ContentType"> | string
    description?: StringNullableWithAggregatesFilter<"ContentType"> | string | null
    version?: IntWithAggregatesFilter<"ContentType"> | number
    schema?: JsonWithAggregatesFilter<"ContentType">
    localization?: JsonWithAggregatesFilter<"ContentType">
    seo?: JsonWithAggregatesFilter<"ContentType">
    createdAt?: DateTimeWithAggregatesFilter<"ContentType"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ContentType"> | Date | string
  }

  export type ContentEntryWhereInput = {
    AND?: ContentEntryWhereInput | ContentEntryWhereInput[]
    OR?: ContentEntryWhereInput[]
    NOT?: ContentEntryWhereInput | ContentEntryWhereInput[]
    id?: StringFilter<"ContentEntry"> | string
    typeId?: StringFilter<"ContentEntry"> | string
    defaultLocale?: StringFilter<"ContentEntry"> | string
    createdAt?: DateTimeFilter<"ContentEntry"> | Date | string
    createdBy?: StringFilter<"ContentEntry"> | string
    deletedAt?: DateTimeNullableFilter<"ContentEntry"> | Date | string | null
    type?: XOR<ContentTypeScalarRelationFilter, ContentTypeWhereInput>
    versions?: ContentVersionListRelationFilter
    lock?: XOR<ContentLockNullableScalarRelationFilter, ContentLockWhereInput> | null
    redirects?: SlugRedirectListRelationFilter
  }

  export type ContentEntryOrderByWithRelationInput = {
    id?: SortOrder
    typeId?: SortOrder
    defaultLocale?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    type?: ContentTypeOrderByWithRelationInput
    versions?: ContentVersionOrderByRelationAggregateInput
    lock?: ContentLockOrderByWithRelationInput
    redirects?: SlugRedirectOrderByRelationAggregateInput
  }

  export type ContentEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContentEntryWhereInput | ContentEntryWhereInput[]
    OR?: ContentEntryWhereInput[]
    NOT?: ContentEntryWhereInput | ContentEntryWhereInput[]
    typeId?: StringFilter<"ContentEntry"> | string
    defaultLocale?: StringFilter<"ContentEntry"> | string
    createdAt?: DateTimeFilter<"ContentEntry"> | Date | string
    createdBy?: StringFilter<"ContentEntry"> | string
    deletedAt?: DateTimeNullableFilter<"ContentEntry"> | Date | string | null
    type?: XOR<ContentTypeScalarRelationFilter, ContentTypeWhereInput>
    versions?: ContentVersionListRelationFilter
    lock?: XOR<ContentLockNullableScalarRelationFilter, ContentLockWhereInput> | null
    redirects?: SlugRedirectListRelationFilter
  }, "id">

  export type ContentEntryOrderByWithAggregationInput = {
    id?: SortOrder
    typeId?: SortOrder
    defaultLocale?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: ContentEntryCountOrderByAggregateInput
    _max?: ContentEntryMaxOrderByAggregateInput
    _min?: ContentEntryMinOrderByAggregateInput
  }

  export type ContentEntryScalarWhereWithAggregatesInput = {
    AND?: ContentEntryScalarWhereWithAggregatesInput | ContentEntryScalarWhereWithAggregatesInput[]
    OR?: ContentEntryScalarWhereWithAggregatesInput[]
    NOT?: ContentEntryScalarWhereWithAggregatesInput | ContentEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContentEntry"> | string
    typeId?: StringWithAggregatesFilter<"ContentEntry"> | string
    defaultLocale?: StringWithAggregatesFilter<"ContentEntry"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ContentEntry"> | Date | string
    createdBy?: StringWithAggregatesFilter<"ContentEntry"> | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"ContentEntry"> | Date | string | null
  }

  export type ContentVersionWhereInput = {
    AND?: ContentVersionWhereInput | ContentVersionWhereInput[]
    OR?: ContentVersionWhereInput[]
    NOT?: ContentVersionWhereInput | ContentVersionWhereInput[]
    id?: StringFilter<"ContentVersion"> | string
    entryId?: StringFilter<"ContentVersion"> | string
    version?: IntFilter<"ContentVersion"> | number
    status?: StringFilter<"ContentVersion"> | string
    data?: JsonFilter<"ContentVersion">
    createdAt?: DateTimeFilter<"ContentVersion"> | Date | string
    createdBy?: StringFilter<"ContentVersion"> | string
    publishedAt?: DateTimeNullableFilter<"ContentVersion"> | Date | string | null
    scheduledAt?: DateTimeNullableFilter<"ContentVersion"> | Date | string | null
    entry?: XOR<ContentEntryScalarRelationFilter, ContentEntryWhereInput>
  }

  export type ContentVersionOrderByWithRelationInput = {
    id?: SortOrder
    entryId?: SortOrder
    version?: SortOrder
    status?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    entry?: ContentEntryOrderByWithRelationInput
  }

  export type ContentVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entryId_version?: ContentVersionEntryIdVersionCompoundUniqueInput
    AND?: ContentVersionWhereInput | ContentVersionWhereInput[]
    OR?: ContentVersionWhereInput[]
    NOT?: ContentVersionWhereInput | ContentVersionWhereInput[]
    entryId?: StringFilter<"ContentVersion"> | string
    version?: IntFilter<"ContentVersion"> | number
    status?: StringFilter<"ContentVersion"> | string
    data?: JsonFilter<"ContentVersion">
    createdAt?: DateTimeFilter<"ContentVersion"> | Date | string
    createdBy?: StringFilter<"ContentVersion"> | string
    publishedAt?: DateTimeNullableFilter<"ContentVersion"> | Date | string | null
    scheduledAt?: DateTimeNullableFilter<"ContentVersion"> | Date | string | null
    entry?: XOR<ContentEntryScalarRelationFilter, ContentEntryWhereInput>
  }, "id" | "entryId_version">

  export type ContentVersionOrderByWithAggregationInput = {
    id?: SortOrder
    entryId?: SortOrder
    version?: SortOrder
    status?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    _count?: ContentVersionCountOrderByAggregateInput
    _avg?: ContentVersionAvgOrderByAggregateInput
    _max?: ContentVersionMaxOrderByAggregateInput
    _min?: ContentVersionMinOrderByAggregateInput
    _sum?: ContentVersionSumOrderByAggregateInput
  }

  export type ContentVersionScalarWhereWithAggregatesInput = {
    AND?: ContentVersionScalarWhereWithAggregatesInput | ContentVersionScalarWhereWithAggregatesInput[]
    OR?: ContentVersionScalarWhereWithAggregatesInput[]
    NOT?: ContentVersionScalarWhereWithAggregatesInput | ContentVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContentVersion"> | string
    entryId?: StringWithAggregatesFilter<"ContentVersion"> | string
    version?: IntWithAggregatesFilter<"ContentVersion"> | number
    status?: StringWithAggregatesFilter<"ContentVersion"> | string
    data?: JsonWithAggregatesFilter<"ContentVersion">
    createdAt?: DateTimeWithAggregatesFilter<"ContentVersion"> | Date | string
    createdBy?: StringWithAggregatesFilter<"ContentVersion"> | string
    publishedAt?: DateTimeNullableWithAggregatesFilter<"ContentVersion"> | Date | string | null
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"ContentVersion"> | Date | string | null
  }

  export type ContentLockWhereInput = {
    AND?: ContentLockWhereInput | ContentLockWhereInput[]
    OR?: ContentLockWhereInput[]
    NOT?: ContentLockWhereInput | ContentLockWhereInput[]
    id?: StringFilter<"ContentLock"> | string
    entryId?: StringFilter<"ContentLock"> | string
    lockedBy?: StringFilter<"ContentLock"> | string
    lockedAt?: DateTimeFilter<"ContentLock"> | Date | string
    expiresAt?: DateTimeFilter<"ContentLock"> | Date | string
    entry?: XOR<ContentEntryScalarRelationFilter, ContentEntryWhereInput>
  }

  export type ContentLockOrderByWithRelationInput = {
    id?: SortOrder
    entryId?: SortOrder
    lockedBy?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
    entry?: ContentEntryOrderByWithRelationInput
  }

  export type ContentLockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entryId?: string
    AND?: ContentLockWhereInput | ContentLockWhereInput[]
    OR?: ContentLockWhereInput[]
    NOT?: ContentLockWhereInput | ContentLockWhereInput[]
    lockedBy?: StringFilter<"ContentLock"> | string
    lockedAt?: DateTimeFilter<"ContentLock"> | Date | string
    expiresAt?: DateTimeFilter<"ContentLock"> | Date | string
    entry?: XOR<ContentEntryScalarRelationFilter, ContentEntryWhereInput>
  }, "id" | "entryId">

  export type ContentLockOrderByWithAggregationInput = {
    id?: SortOrder
    entryId?: SortOrder
    lockedBy?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
    _count?: ContentLockCountOrderByAggregateInput
    _max?: ContentLockMaxOrderByAggregateInput
    _min?: ContentLockMinOrderByAggregateInput
  }

  export type ContentLockScalarWhereWithAggregatesInput = {
    AND?: ContentLockScalarWhereWithAggregatesInput | ContentLockScalarWhereWithAggregatesInput[]
    OR?: ContentLockScalarWhereWithAggregatesInput[]
    NOT?: ContentLockScalarWhereWithAggregatesInput | ContentLockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContentLock"> | string
    entryId?: StringWithAggregatesFilter<"ContentLock"> | string
    lockedBy?: StringWithAggregatesFilter<"ContentLock"> | string
    lockedAt?: DateTimeWithAggregatesFilter<"ContentLock"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"ContentLock"> | Date | string
  }

  export type SlugRedirectWhereInput = {
    AND?: SlugRedirectWhereInput | SlugRedirectWhereInput[]
    OR?: SlugRedirectWhereInput[]
    NOT?: SlugRedirectWhereInput | SlugRedirectWhereInput[]
    id?: StringFilter<"SlugRedirect"> | string
    contentTypeId?: StringFilter<"SlugRedirect"> | string
    locale?: StringFilter<"SlugRedirect"> | string
    fromSlug?: StringFilter<"SlugRedirect"> | string
    toEntryId?: StringFilter<"SlugRedirect"> | string
    createdAt?: DateTimeFilter<"SlugRedirect"> | Date | string
    contentType?: XOR<ContentTypeScalarRelationFilter, ContentTypeWhereInput>
    toEntry?: XOR<ContentEntryScalarRelationFilter, ContentEntryWhereInput>
  }

  export type SlugRedirectOrderByWithRelationInput = {
    id?: SortOrder
    contentTypeId?: SortOrder
    locale?: SortOrder
    fromSlug?: SortOrder
    toEntryId?: SortOrder
    createdAt?: SortOrder
    contentType?: ContentTypeOrderByWithRelationInput
    toEntry?: ContentEntryOrderByWithRelationInput
  }

  export type SlugRedirectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    contentTypeId_locale_fromSlug?: SlugRedirectContentTypeIdLocaleFromSlugCompoundUniqueInput
    AND?: SlugRedirectWhereInput | SlugRedirectWhereInput[]
    OR?: SlugRedirectWhereInput[]
    NOT?: SlugRedirectWhereInput | SlugRedirectWhereInput[]
    contentTypeId?: StringFilter<"SlugRedirect"> | string
    locale?: StringFilter<"SlugRedirect"> | string
    fromSlug?: StringFilter<"SlugRedirect"> | string
    toEntryId?: StringFilter<"SlugRedirect"> | string
    createdAt?: DateTimeFilter<"SlugRedirect"> | Date | string
    contentType?: XOR<ContentTypeScalarRelationFilter, ContentTypeWhereInput>
    toEntry?: XOR<ContentEntryScalarRelationFilter, ContentEntryWhereInput>
  }, "id" | "contentTypeId_locale_fromSlug">

  export type SlugRedirectOrderByWithAggregationInput = {
    id?: SortOrder
    contentTypeId?: SortOrder
    locale?: SortOrder
    fromSlug?: SortOrder
    toEntryId?: SortOrder
    createdAt?: SortOrder
    _count?: SlugRedirectCountOrderByAggregateInput
    _max?: SlugRedirectMaxOrderByAggregateInput
    _min?: SlugRedirectMinOrderByAggregateInput
  }

  export type SlugRedirectScalarWhereWithAggregatesInput = {
    AND?: SlugRedirectScalarWhereWithAggregatesInput | SlugRedirectScalarWhereWithAggregatesInput[]
    OR?: SlugRedirectScalarWhereWithAggregatesInput[]
    NOT?: SlugRedirectScalarWhereWithAggregatesInput | SlugRedirectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SlugRedirect"> | string
    contentTypeId?: StringWithAggregatesFilter<"SlugRedirect"> | string
    locale?: StringWithAggregatesFilter<"SlugRedirect"> | string
    fromSlug?: StringWithAggregatesFilter<"SlugRedirect"> | string
    toEntryId?: StringWithAggregatesFilter<"SlugRedirect"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SlugRedirect"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: StringFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    displayName?: StringFilter<"Role"> | string
    permissions?: JsonFilter<"Role">
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    users?: UserRoleListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserRoleOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    displayName?: StringFilter<"Role"> | string
    permissions?: JsonFilter<"Role">
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    users?: UserRoleListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
    displayName?: StringWithAggregatesFilter<"Role"> | string
    permissions?: JsonWithAggregatesFilter<"Role">
    createdAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
  }

  export type UserRoleWhereInput = {
    AND?: UserRoleWhereInput | UserRoleWhereInput[]
    OR?: UserRoleWhereInput[]
    NOT?: UserRoleWhereInput | UserRoleWhereInput[]
    userId?: StringFilter<"UserRole"> | string
    roleId?: StringFilter<"UserRole"> | string
    assignedAt?: DateTimeFilter<"UserRole"> | Date | string
    assignedBy?: StringFilter<"UserRole"> | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }

  export type UserRoleOrderByWithRelationInput = {
    userId?: SortOrder
    roleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
    role?: RoleOrderByWithRelationInput
  }

  export type UserRoleWhereUniqueInput = Prisma.AtLeast<{
    userId_roleId?: UserRoleUserIdRoleIdCompoundUniqueInput
    AND?: UserRoleWhereInput | UserRoleWhereInput[]
    OR?: UserRoleWhereInput[]
    NOT?: UserRoleWhereInput | UserRoleWhereInput[]
    userId?: StringFilter<"UserRole"> | string
    roleId?: StringFilter<"UserRole"> | string
    assignedAt?: DateTimeFilter<"UserRole"> | Date | string
    assignedBy?: StringFilter<"UserRole"> | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }, "userId_roleId">

  export type UserRoleOrderByWithAggregationInput = {
    userId?: SortOrder
    roleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
    _count?: UserRoleCountOrderByAggregateInput
    _max?: UserRoleMaxOrderByAggregateInput
    _min?: UserRoleMinOrderByAggregateInput
  }

  export type UserRoleScalarWhereWithAggregatesInput = {
    AND?: UserRoleScalarWhereWithAggregatesInput | UserRoleScalarWhereWithAggregatesInput[]
    OR?: UserRoleScalarWhereWithAggregatesInput[]
    NOT?: UserRoleScalarWhereWithAggregatesInput | UserRoleScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"UserRole"> | string
    roleId?: StringWithAggregatesFilter<"UserRole"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"UserRole"> | Date | string
    assignedBy?: StringWithAggregatesFilter<"UserRole"> | string
  }

  export type ContentTypeCreateInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: ContentEntryCreateNestedManyWithoutTypeInput
    redirects?: SlugRedirectCreateNestedManyWithoutContentTypeInput
  }

  export type ContentTypeUncheckedCreateInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: ContentEntryUncheckedCreateNestedManyWithoutTypeInput
    redirects?: SlugRedirectUncheckedCreateNestedManyWithoutContentTypeInput
  }

  export type ContentTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: ContentEntryUpdateManyWithoutTypeNestedInput
    redirects?: SlugRedirectUpdateManyWithoutContentTypeNestedInput
  }

  export type ContentTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: ContentEntryUncheckedUpdateManyWithoutTypeNestedInput
    redirects?: SlugRedirectUncheckedUpdateManyWithoutContentTypeNestedInput
  }

  export type ContentTypeCreateManyInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContentTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentEntryCreateInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    type: ContentTypeCreateNestedOneWithoutEntriesInput
    versions?: ContentVersionCreateNestedManyWithoutEntryInput
    lock?: ContentLockCreateNestedOneWithoutEntryInput
    redirects?: SlugRedirectCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryUncheckedCreateInput = {
    id?: string
    typeId: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    versions?: ContentVersionUncheckedCreateNestedManyWithoutEntryInput
    lock?: ContentLockUncheckedCreateNestedOneWithoutEntryInput
    redirects?: SlugRedirectUncheckedCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    type?: ContentTypeUpdateOneRequiredWithoutEntriesNestedInput
    versions?: ContentVersionUpdateManyWithoutEntryNestedInput
    lock?: ContentLockUpdateOneWithoutEntryNestedInput
    redirects?: SlugRedirectUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versions?: ContentVersionUncheckedUpdateManyWithoutEntryNestedInput
    lock?: ContentLockUncheckedUpdateOneWithoutEntryNestedInput
    redirects?: SlugRedirectUncheckedUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryCreateManyInput = {
    id?: string
    typeId: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
  }

  export type ContentEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentVersionCreateInput = {
    id?: string
    version: number
    status: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    createdBy: string
    publishedAt?: Date | string | null
    scheduledAt?: Date | string | null
    entry: ContentEntryCreateNestedOneWithoutVersionsInput
  }

  export type ContentVersionUncheckedCreateInput = {
    id?: string
    entryId: string
    version: number
    status: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    createdBy: string
    publishedAt?: Date | string | null
    scheduledAt?: Date | string | null
  }

  export type ContentVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    entry?: ContentEntryUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type ContentVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentVersionCreateManyInput = {
    id?: string
    entryId: string
    version: number
    status: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    createdBy: string
    publishedAt?: Date | string | null
    scheduledAt?: Date | string | null
  }

  export type ContentVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentLockCreateInput = {
    id?: string
    lockedBy: string
    lockedAt?: Date | string
    expiresAt: Date | string
    entry: ContentEntryCreateNestedOneWithoutLockInput
  }

  export type ContentLockUncheckedCreateInput = {
    id?: string
    entryId: string
    lockedBy: string
    lockedAt?: Date | string
    expiresAt: Date | string
  }

  export type ContentLockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockedBy?: StringFieldUpdateOperationsInput | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entry?: ContentEntryUpdateOneRequiredWithoutLockNestedInput
  }

  export type ContentLockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    lockedBy?: StringFieldUpdateOperationsInput | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentLockCreateManyInput = {
    id?: string
    entryId: string
    lockedBy: string
    lockedAt?: Date | string
    expiresAt: Date | string
  }

  export type ContentLockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockedBy?: StringFieldUpdateOperationsInput | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentLockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    lockedBy?: StringFieldUpdateOperationsInput | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlugRedirectCreateInput = {
    id?: string
    locale: string
    fromSlug: string
    createdAt?: Date | string
    contentType: ContentTypeCreateNestedOneWithoutRedirectsInput
    toEntry: ContentEntryCreateNestedOneWithoutRedirectsInput
  }

  export type SlugRedirectUncheckedCreateInput = {
    id?: string
    contentTypeId: string
    locale: string
    fromSlug: string
    toEntryId: string
    createdAt?: Date | string
  }

  export type SlugRedirectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contentType?: ContentTypeUpdateOneRequiredWithoutRedirectsNestedInput
    toEntry?: ContentEntryUpdateOneRequiredWithoutRedirectsNestedInput
  }

  export type SlugRedirectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentTypeId?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    toEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlugRedirectCreateManyInput = {
    id?: string
    contentTypeId: string
    locale: string
    fromSlug: string
    toEntryId: string
    createdAt?: Date | string
  }

  export type SlugRedirectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlugRedirectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentTypeId?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    toEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    displayName: string
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserRoleCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    displayName: string
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserRoleUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserRoleUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserRoleUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
    displayName: string
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRoleCreateInput = {
    userId: string
    assignedAt?: Date | string
    assignedBy: string
    role: RoleCreateNestedOneWithoutUsersInput
  }

  export type UserRoleUncheckedCreateInput = {
    userId: string
    roleId: string
    assignedAt?: Date | string
    assignedBy: string
  }

  export type UserRoleUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserRoleUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleCreateManyInput = {
    userId: string
    roleId: string
    assignedAt?: Date | string
    assignedBy: string
  }

  export type UserRoleUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ContentEntryListRelationFilter = {
    every?: ContentEntryWhereInput
    some?: ContentEntryWhereInput
    none?: ContentEntryWhereInput
  }

  export type SlugRedirectListRelationFilter = {
    every?: SlugRedirectWhereInput
    some?: SlugRedirectWhereInput
    none?: SlugRedirectWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ContentEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SlugRedirectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContentTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    description?: SortOrder
    version?: SortOrder
    schema?: SortOrder
    localization?: SortOrder
    seo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContentTypeAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ContentTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    description?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContentTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    description?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContentTypeSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ContentTypeScalarRelationFilter = {
    is?: ContentTypeWhereInput
    isNot?: ContentTypeWhereInput
  }

  export type ContentVersionListRelationFilter = {
    every?: ContentVersionWhereInput
    some?: ContentVersionWhereInput
    none?: ContentVersionWhereInput
  }

  export type ContentLockNullableScalarRelationFilter = {
    is?: ContentLockWhereInput | null
    isNot?: ContentLockWhereInput | null
  }

  export type ContentVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContentEntryCountOrderByAggregateInput = {
    id?: SortOrder
    typeId?: SortOrder
    defaultLocale?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    deletedAt?: SortOrder
  }

  export type ContentEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    typeId?: SortOrder
    defaultLocale?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    deletedAt?: SortOrder
  }

  export type ContentEntryMinOrderByAggregateInput = {
    id?: SortOrder
    typeId?: SortOrder
    defaultLocale?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    deletedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ContentEntryScalarRelationFilter = {
    is?: ContentEntryWhereInput
    isNot?: ContentEntryWhereInput
  }

  export type ContentVersionEntryIdVersionCompoundUniqueInput = {
    entryId: string
    version: number
  }

  export type ContentVersionCountOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    version?: SortOrder
    status?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    publishedAt?: SortOrder
    scheduledAt?: SortOrder
  }

  export type ContentVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ContentVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    version?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    publishedAt?: SortOrder
    scheduledAt?: SortOrder
  }

  export type ContentVersionMinOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    version?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    publishedAt?: SortOrder
    scheduledAt?: SortOrder
  }

  export type ContentVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ContentLockCountOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    lockedBy?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ContentLockMaxOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    lockedBy?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ContentLockMinOrderByAggregateInput = {
    id?: SortOrder
    entryId?: SortOrder
    lockedBy?: SortOrder
    lockedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type SlugRedirectContentTypeIdLocaleFromSlugCompoundUniqueInput = {
    contentTypeId: string
    locale: string
    fromSlug: string
  }

  export type SlugRedirectCountOrderByAggregateInput = {
    id?: SortOrder
    contentTypeId?: SortOrder
    locale?: SortOrder
    fromSlug?: SortOrder
    toEntryId?: SortOrder
    createdAt?: SortOrder
  }

  export type SlugRedirectMaxOrderByAggregateInput = {
    id?: SortOrder
    contentTypeId?: SortOrder
    locale?: SortOrder
    fromSlug?: SortOrder
    toEntryId?: SortOrder
    createdAt?: SortOrder
  }

  export type SlugRedirectMinOrderByAggregateInput = {
    id?: SortOrder
    contentTypeId?: SortOrder
    locale?: SortOrder
    fromSlug?: SortOrder
    toEntryId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserRoleListRelationFilter = {
    every?: UserRoleWhereInput
    some?: UserRoleWhereInput
    none?: UserRoleWhereInput
  }

  export type UserRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    permissions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type UserRoleUserIdRoleIdCompoundUniqueInput = {
    userId: string
    roleId: string
  }

  export type UserRoleCountOrderByAggregateInput = {
    userId?: SortOrder
    roleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
  }

  export type UserRoleMaxOrderByAggregateInput = {
    userId?: SortOrder
    roleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
  }

  export type UserRoleMinOrderByAggregateInput = {
    userId?: SortOrder
    roleId?: SortOrder
    assignedAt?: SortOrder
    assignedBy?: SortOrder
  }

  export type ContentEntryCreateNestedManyWithoutTypeInput = {
    create?: XOR<ContentEntryCreateWithoutTypeInput, ContentEntryUncheckedCreateWithoutTypeInput> | ContentEntryCreateWithoutTypeInput[] | ContentEntryUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: ContentEntryCreateOrConnectWithoutTypeInput | ContentEntryCreateOrConnectWithoutTypeInput[]
    createMany?: ContentEntryCreateManyTypeInputEnvelope
    connect?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
  }

  export type SlugRedirectCreateNestedManyWithoutContentTypeInput = {
    create?: XOR<SlugRedirectCreateWithoutContentTypeInput, SlugRedirectUncheckedCreateWithoutContentTypeInput> | SlugRedirectCreateWithoutContentTypeInput[] | SlugRedirectUncheckedCreateWithoutContentTypeInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutContentTypeInput | SlugRedirectCreateOrConnectWithoutContentTypeInput[]
    createMany?: SlugRedirectCreateManyContentTypeInputEnvelope
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
  }

  export type ContentEntryUncheckedCreateNestedManyWithoutTypeInput = {
    create?: XOR<ContentEntryCreateWithoutTypeInput, ContentEntryUncheckedCreateWithoutTypeInput> | ContentEntryCreateWithoutTypeInput[] | ContentEntryUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: ContentEntryCreateOrConnectWithoutTypeInput | ContentEntryCreateOrConnectWithoutTypeInput[]
    createMany?: ContentEntryCreateManyTypeInputEnvelope
    connect?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
  }

  export type SlugRedirectUncheckedCreateNestedManyWithoutContentTypeInput = {
    create?: XOR<SlugRedirectCreateWithoutContentTypeInput, SlugRedirectUncheckedCreateWithoutContentTypeInput> | SlugRedirectCreateWithoutContentTypeInput[] | SlugRedirectUncheckedCreateWithoutContentTypeInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutContentTypeInput | SlugRedirectCreateOrConnectWithoutContentTypeInput[]
    createMany?: SlugRedirectCreateManyContentTypeInputEnvelope
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ContentEntryUpdateManyWithoutTypeNestedInput = {
    create?: XOR<ContentEntryCreateWithoutTypeInput, ContentEntryUncheckedCreateWithoutTypeInput> | ContentEntryCreateWithoutTypeInput[] | ContentEntryUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: ContentEntryCreateOrConnectWithoutTypeInput | ContentEntryCreateOrConnectWithoutTypeInput[]
    upsert?: ContentEntryUpsertWithWhereUniqueWithoutTypeInput | ContentEntryUpsertWithWhereUniqueWithoutTypeInput[]
    createMany?: ContentEntryCreateManyTypeInputEnvelope
    set?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    disconnect?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    delete?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    connect?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    update?: ContentEntryUpdateWithWhereUniqueWithoutTypeInput | ContentEntryUpdateWithWhereUniqueWithoutTypeInput[]
    updateMany?: ContentEntryUpdateManyWithWhereWithoutTypeInput | ContentEntryUpdateManyWithWhereWithoutTypeInput[]
    deleteMany?: ContentEntryScalarWhereInput | ContentEntryScalarWhereInput[]
  }

  export type SlugRedirectUpdateManyWithoutContentTypeNestedInput = {
    create?: XOR<SlugRedirectCreateWithoutContentTypeInput, SlugRedirectUncheckedCreateWithoutContentTypeInput> | SlugRedirectCreateWithoutContentTypeInput[] | SlugRedirectUncheckedCreateWithoutContentTypeInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutContentTypeInput | SlugRedirectCreateOrConnectWithoutContentTypeInput[]
    upsert?: SlugRedirectUpsertWithWhereUniqueWithoutContentTypeInput | SlugRedirectUpsertWithWhereUniqueWithoutContentTypeInput[]
    createMany?: SlugRedirectCreateManyContentTypeInputEnvelope
    set?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    disconnect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    delete?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    update?: SlugRedirectUpdateWithWhereUniqueWithoutContentTypeInput | SlugRedirectUpdateWithWhereUniqueWithoutContentTypeInput[]
    updateMany?: SlugRedirectUpdateManyWithWhereWithoutContentTypeInput | SlugRedirectUpdateManyWithWhereWithoutContentTypeInput[]
    deleteMany?: SlugRedirectScalarWhereInput | SlugRedirectScalarWhereInput[]
  }

  export type ContentEntryUncheckedUpdateManyWithoutTypeNestedInput = {
    create?: XOR<ContentEntryCreateWithoutTypeInput, ContentEntryUncheckedCreateWithoutTypeInput> | ContentEntryCreateWithoutTypeInput[] | ContentEntryUncheckedCreateWithoutTypeInput[]
    connectOrCreate?: ContentEntryCreateOrConnectWithoutTypeInput | ContentEntryCreateOrConnectWithoutTypeInput[]
    upsert?: ContentEntryUpsertWithWhereUniqueWithoutTypeInput | ContentEntryUpsertWithWhereUniqueWithoutTypeInput[]
    createMany?: ContentEntryCreateManyTypeInputEnvelope
    set?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    disconnect?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    delete?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    connect?: ContentEntryWhereUniqueInput | ContentEntryWhereUniqueInput[]
    update?: ContentEntryUpdateWithWhereUniqueWithoutTypeInput | ContentEntryUpdateWithWhereUniqueWithoutTypeInput[]
    updateMany?: ContentEntryUpdateManyWithWhereWithoutTypeInput | ContentEntryUpdateManyWithWhereWithoutTypeInput[]
    deleteMany?: ContentEntryScalarWhereInput | ContentEntryScalarWhereInput[]
  }

  export type SlugRedirectUncheckedUpdateManyWithoutContentTypeNestedInput = {
    create?: XOR<SlugRedirectCreateWithoutContentTypeInput, SlugRedirectUncheckedCreateWithoutContentTypeInput> | SlugRedirectCreateWithoutContentTypeInput[] | SlugRedirectUncheckedCreateWithoutContentTypeInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutContentTypeInput | SlugRedirectCreateOrConnectWithoutContentTypeInput[]
    upsert?: SlugRedirectUpsertWithWhereUniqueWithoutContentTypeInput | SlugRedirectUpsertWithWhereUniqueWithoutContentTypeInput[]
    createMany?: SlugRedirectCreateManyContentTypeInputEnvelope
    set?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    disconnect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    delete?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    update?: SlugRedirectUpdateWithWhereUniqueWithoutContentTypeInput | SlugRedirectUpdateWithWhereUniqueWithoutContentTypeInput[]
    updateMany?: SlugRedirectUpdateManyWithWhereWithoutContentTypeInput | SlugRedirectUpdateManyWithWhereWithoutContentTypeInput[]
    deleteMany?: SlugRedirectScalarWhereInput | SlugRedirectScalarWhereInput[]
  }

  export type ContentTypeCreateNestedOneWithoutEntriesInput = {
    create?: XOR<ContentTypeCreateWithoutEntriesInput, ContentTypeUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: ContentTypeCreateOrConnectWithoutEntriesInput
    connect?: ContentTypeWhereUniqueInput
  }

  export type ContentVersionCreateNestedManyWithoutEntryInput = {
    create?: XOR<ContentVersionCreateWithoutEntryInput, ContentVersionUncheckedCreateWithoutEntryInput> | ContentVersionCreateWithoutEntryInput[] | ContentVersionUncheckedCreateWithoutEntryInput[]
    connectOrCreate?: ContentVersionCreateOrConnectWithoutEntryInput | ContentVersionCreateOrConnectWithoutEntryInput[]
    createMany?: ContentVersionCreateManyEntryInputEnvelope
    connect?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
  }

  export type ContentLockCreateNestedOneWithoutEntryInput = {
    create?: XOR<ContentLockCreateWithoutEntryInput, ContentLockUncheckedCreateWithoutEntryInput>
    connectOrCreate?: ContentLockCreateOrConnectWithoutEntryInput
    connect?: ContentLockWhereUniqueInput
  }

  export type SlugRedirectCreateNestedManyWithoutToEntryInput = {
    create?: XOR<SlugRedirectCreateWithoutToEntryInput, SlugRedirectUncheckedCreateWithoutToEntryInput> | SlugRedirectCreateWithoutToEntryInput[] | SlugRedirectUncheckedCreateWithoutToEntryInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutToEntryInput | SlugRedirectCreateOrConnectWithoutToEntryInput[]
    createMany?: SlugRedirectCreateManyToEntryInputEnvelope
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
  }

  export type ContentVersionUncheckedCreateNestedManyWithoutEntryInput = {
    create?: XOR<ContentVersionCreateWithoutEntryInput, ContentVersionUncheckedCreateWithoutEntryInput> | ContentVersionCreateWithoutEntryInput[] | ContentVersionUncheckedCreateWithoutEntryInput[]
    connectOrCreate?: ContentVersionCreateOrConnectWithoutEntryInput | ContentVersionCreateOrConnectWithoutEntryInput[]
    createMany?: ContentVersionCreateManyEntryInputEnvelope
    connect?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
  }

  export type ContentLockUncheckedCreateNestedOneWithoutEntryInput = {
    create?: XOR<ContentLockCreateWithoutEntryInput, ContentLockUncheckedCreateWithoutEntryInput>
    connectOrCreate?: ContentLockCreateOrConnectWithoutEntryInput
    connect?: ContentLockWhereUniqueInput
  }

  export type SlugRedirectUncheckedCreateNestedManyWithoutToEntryInput = {
    create?: XOR<SlugRedirectCreateWithoutToEntryInput, SlugRedirectUncheckedCreateWithoutToEntryInput> | SlugRedirectCreateWithoutToEntryInput[] | SlugRedirectUncheckedCreateWithoutToEntryInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutToEntryInput | SlugRedirectCreateOrConnectWithoutToEntryInput[]
    createMany?: SlugRedirectCreateManyToEntryInputEnvelope
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ContentTypeUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: XOR<ContentTypeCreateWithoutEntriesInput, ContentTypeUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: ContentTypeCreateOrConnectWithoutEntriesInput
    upsert?: ContentTypeUpsertWithoutEntriesInput
    connect?: ContentTypeWhereUniqueInput
    update?: XOR<XOR<ContentTypeUpdateToOneWithWhereWithoutEntriesInput, ContentTypeUpdateWithoutEntriesInput>, ContentTypeUncheckedUpdateWithoutEntriesInput>
  }

  export type ContentVersionUpdateManyWithoutEntryNestedInput = {
    create?: XOR<ContentVersionCreateWithoutEntryInput, ContentVersionUncheckedCreateWithoutEntryInput> | ContentVersionCreateWithoutEntryInput[] | ContentVersionUncheckedCreateWithoutEntryInput[]
    connectOrCreate?: ContentVersionCreateOrConnectWithoutEntryInput | ContentVersionCreateOrConnectWithoutEntryInput[]
    upsert?: ContentVersionUpsertWithWhereUniqueWithoutEntryInput | ContentVersionUpsertWithWhereUniqueWithoutEntryInput[]
    createMany?: ContentVersionCreateManyEntryInputEnvelope
    set?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    disconnect?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    delete?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    connect?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    update?: ContentVersionUpdateWithWhereUniqueWithoutEntryInput | ContentVersionUpdateWithWhereUniqueWithoutEntryInput[]
    updateMany?: ContentVersionUpdateManyWithWhereWithoutEntryInput | ContentVersionUpdateManyWithWhereWithoutEntryInput[]
    deleteMany?: ContentVersionScalarWhereInput | ContentVersionScalarWhereInput[]
  }

  export type ContentLockUpdateOneWithoutEntryNestedInput = {
    create?: XOR<ContentLockCreateWithoutEntryInput, ContentLockUncheckedCreateWithoutEntryInput>
    connectOrCreate?: ContentLockCreateOrConnectWithoutEntryInput
    upsert?: ContentLockUpsertWithoutEntryInput
    disconnect?: ContentLockWhereInput | boolean
    delete?: ContentLockWhereInput | boolean
    connect?: ContentLockWhereUniqueInput
    update?: XOR<XOR<ContentLockUpdateToOneWithWhereWithoutEntryInput, ContentLockUpdateWithoutEntryInput>, ContentLockUncheckedUpdateWithoutEntryInput>
  }

  export type SlugRedirectUpdateManyWithoutToEntryNestedInput = {
    create?: XOR<SlugRedirectCreateWithoutToEntryInput, SlugRedirectUncheckedCreateWithoutToEntryInput> | SlugRedirectCreateWithoutToEntryInput[] | SlugRedirectUncheckedCreateWithoutToEntryInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutToEntryInput | SlugRedirectCreateOrConnectWithoutToEntryInput[]
    upsert?: SlugRedirectUpsertWithWhereUniqueWithoutToEntryInput | SlugRedirectUpsertWithWhereUniqueWithoutToEntryInput[]
    createMany?: SlugRedirectCreateManyToEntryInputEnvelope
    set?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    disconnect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    delete?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    update?: SlugRedirectUpdateWithWhereUniqueWithoutToEntryInput | SlugRedirectUpdateWithWhereUniqueWithoutToEntryInput[]
    updateMany?: SlugRedirectUpdateManyWithWhereWithoutToEntryInput | SlugRedirectUpdateManyWithWhereWithoutToEntryInput[]
    deleteMany?: SlugRedirectScalarWhereInput | SlugRedirectScalarWhereInput[]
  }

  export type ContentVersionUncheckedUpdateManyWithoutEntryNestedInput = {
    create?: XOR<ContentVersionCreateWithoutEntryInput, ContentVersionUncheckedCreateWithoutEntryInput> | ContentVersionCreateWithoutEntryInput[] | ContentVersionUncheckedCreateWithoutEntryInput[]
    connectOrCreate?: ContentVersionCreateOrConnectWithoutEntryInput | ContentVersionCreateOrConnectWithoutEntryInput[]
    upsert?: ContentVersionUpsertWithWhereUniqueWithoutEntryInput | ContentVersionUpsertWithWhereUniqueWithoutEntryInput[]
    createMany?: ContentVersionCreateManyEntryInputEnvelope
    set?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    disconnect?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    delete?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    connect?: ContentVersionWhereUniqueInput | ContentVersionWhereUniqueInput[]
    update?: ContentVersionUpdateWithWhereUniqueWithoutEntryInput | ContentVersionUpdateWithWhereUniqueWithoutEntryInput[]
    updateMany?: ContentVersionUpdateManyWithWhereWithoutEntryInput | ContentVersionUpdateManyWithWhereWithoutEntryInput[]
    deleteMany?: ContentVersionScalarWhereInput | ContentVersionScalarWhereInput[]
  }

  export type ContentLockUncheckedUpdateOneWithoutEntryNestedInput = {
    create?: XOR<ContentLockCreateWithoutEntryInput, ContentLockUncheckedCreateWithoutEntryInput>
    connectOrCreate?: ContentLockCreateOrConnectWithoutEntryInput
    upsert?: ContentLockUpsertWithoutEntryInput
    disconnect?: ContentLockWhereInput | boolean
    delete?: ContentLockWhereInput | boolean
    connect?: ContentLockWhereUniqueInput
    update?: XOR<XOR<ContentLockUpdateToOneWithWhereWithoutEntryInput, ContentLockUpdateWithoutEntryInput>, ContentLockUncheckedUpdateWithoutEntryInput>
  }

  export type SlugRedirectUncheckedUpdateManyWithoutToEntryNestedInput = {
    create?: XOR<SlugRedirectCreateWithoutToEntryInput, SlugRedirectUncheckedCreateWithoutToEntryInput> | SlugRedirectCreateWithoutToEntryInput[] | SlugRedirectUncheckedCreateWithoutToEntryInput[]
    connectOrCreate?: SlugRedirectCreateOrConnectWithoutToEntryInput | SlugRedirectCreateOrConnectWithoutToEntryInput[]
    upsert?: SlugRedirectUpsertWithWhereUniqueWithoutToEntryInput | SlugRedirectUpsertWithWhereUniqueWithoutToEntryInput[]
    createMany?: SlugRedirectCreateManyToEntryInputEnvelope
    set?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    disconnect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    delete?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    connect?: SlugRedirectWhereUniqueInput | SlugRedirectWhereUniqueInput[]
    update?: SlugRedirectUpdateWithWhereUniqueWithoutToEntryInput | SlugRedirectUpdateWithWhereUniqueWithoutToEntryInput[]
    updateMany?: SlugRedirectUpdateManyWithWhereWithoutToEntryInput | SlugRedirectUpdateManyWithWhereWithoutToEntryInput[]
    deleteMany?: SlugRedirectScalarWhereInput | SlugRedirectScalarWhereInput[]
  }

  export type ContentEntryCreateNestedOneWithoutVersionsInput = {
    create?: XOR<ContentEntryCreateWithoutVersionsInput, ContentEntryUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ContentEntryCreateOrConnectWithoutVersionsInput
    connect?: ContentEntryWhereUniqueInput
  }

  export type ContentEntryUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<ContentEntryCreateWithoutVersionsInput, ContentEntryUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ContentEntryCreateOrConnectWithoutVersionsInput
    upsert?: ContentEntryUpsertWithoutVersionsInput
    connect?: ContentEntryWhereUniqueInput
    update?: XOR<XOR<ContentEntryUpdateToOneWithWhereWithoutVersionsInput, ContentEntryUpdateWithoutVersionsInput>, ContentEntryUncheckedUpdateWithoutVersionsInput>
  }

  export type ContentEntryCreateNestedOneWithoutLockInput = {
    create?: XOR<ContentEntryCreateWithoutLockInput, ContentEntryUncheckedCreateWithoutLockInput>
    connectOrCreate?: ContentEntryCreateOrConnectWithoutLockInput
    connect?: ContentEntryWhereUniqueInput
  }

  export type ContentEntryUpdateOneRequiredWithoutLockNestedInput = {
    create?: XOR<ContentEntryCreateWithoutLockInput, ContentEntryUncheckedCreateWithoutLockInput>
    connectOrCreate?: ContentEntryCreateOrConnectWithoutLockInput
    upsert?: ContentEntryUpsertWithoutLockInput
    connect?: ContentEntryWhereUniqueInput
    update?: XOR<XOR<ContentEntryUpdateToOneWithWhereWithoutLockInput, ContentEntryUpdateWithoutLockInput>, ContentEntryUncheckedUpdateWithoutLockInput>
  }

  export type ContentTypeCreateNestedOneWithoutRedirectsInput = {
    create?: XOR<ContentTypeCreateWithoutRedirectsInput, ContentTypeUncheckedCreateWithoutRedirectsInput>
    connectOrCreate?: ContentTypeCreateOrConnectWithoutRedirectsInput
    connect?: ContentTypeWhereUniqueInput
  }

  export type ContentEntryCreateNestedOneWithoutRedirectsInput = {
    create?: XOR<ContentEntryCreateWithoutRedirectsInput, ContentEntryUncheckedCreateWithoutRedirectsInput>
    connectOrCreate?: ContentEntryCreateOrConnectWithoutRedirectsInput
    connect?: ContentEntryWhereUniqueInput
  }

  export type ContentTypeUpdateOneRequiredWithoutRedirectsNestedInput = {
    create?: XOR<ContentTypeCreateWithoutRedirectsInput, ContentTypeUncheckedCreateWithoutRedirectsInput>
    connectOrCreate?: ContentTypeCreateOrConnectWithoutRedirectsInput
    upsert?: ContentTypeUpsertWithoutRedirectsInput
    connect?: ContentTypeWhereUniqueInput
    update?: XOR<XOR<ContentTypeUpdateToOneWithWhereWithoutRedirectsInput, ContentTypeUpdateWithoutRedirectsInput>, ContentTypeUncheckedUpdateWithoutRedirectsInput>
  }

  export type ContentEntryUpdateOneRequiredWithoutRedirectsNestedInput = {
    create?: XOR<ContentEntryCreateWithoutRedirectsInput, ContentEntryUncheckedCreateWithoutRedirectsInput>
    connectOrCreate?: ContentEntryCreateOrConnectWithoutRedirectsInput
    upsert?: ContentEntryUpsertWithoutRedirectsInput
    connect?: ContentEntryWhereUniqueInput
    update?: XOR<XOR<ContentEntryUpdateToOneWithWhereWithoutRedirectsInput, ContentEntryUpdateWithoutRedirectsInput>, ContentEntryUncheckedUpdateWithoutRedirectsInput>
  }

  export type UserRoleCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type UserRoleUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type UserRoleUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutRoleInput | UserRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutRoleInput | UserRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutRoleInput | UserRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type UserRoleUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutRoleInput | UserRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutRoleInput | UserRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutRoleInput | UserRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutUsersInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    connect?: RoleWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    upsert?: RoleUpsertWithoutUsersInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUsersInput, RoleUpdateWithoutUsersInput>, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ContentEntryCreateWithoutTypeInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    versions?: ContentVersionCreateNestedManyWithoutEntryInput
    lock?: ContentLockCreateNestedOneWithoutEntryInput
    redirects?: SlugRedirectCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryUncheckedCreateWithoutTypeInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    versions?: ContentVersionUncheckedCreateNestedManyWithoutEntryInput
    lock?: ContentLockUncheckedCreateNestedOneWithoutEntryInput
    redirects?: SlugRedirectUncheckedCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryCreateOrConnectWithoutTypeInput = {
    where: ContentEntryWhereUniqueInput
    create: XOR<ContentEntryCreateWithoutTypeInput, ContentEntryUncheckedCreateWithoutTypeInput>
  }

  export type ContentEntryCreateManyTypeInputEnvelope = {
    data: ContentEntryCreateManyTypeInput | ContentEntryCreateManyTypeInput[]
    skipDuplicates?: boolean
  }

  export type SlugRedirectCreateWithoutContentTypeInput = {
    id?: string
    locale: string
    fromSlug: string
    createdAt?: Date | string
    toEntry: ContentEntryCreateNestedOneWithoutRedirectsInput
  }

  export type SlugRedirectUncheckedCreateWithoutContentTypeInput = {
    id?: string
    locale: string
    fromSlug: string
    toEntryId: string
    createdAt?: Date | string
  }

  export type SlugRedirectCreateOrConnectWithoutContentTypeInput = {
    where: SlugRedirectWhereUniqueInput
    create: XOR<SlugRedirectCreateWithoutContentTypeInput, SlugRedirectUncheckedCreateWithoutContentTypeInput>
  }

  export type SlugRedirectCreateManyContentTypeInputEnvelope = {
    data: SlugRedirectCreateManyContentTypeInput | SlugRedirectCreateManyContentTypeInput[]
    skipDuplicates?: boolean
  }

  export type ContentEntryUpsertWithWhereUniqueWithoutTypeInput = {
    where: ContentEntryWhereUniqueInput
    update: XOR<ContentEntryUpdateWithoutTypeInput, ContentEntryUncheckedUpdateWithoutTypeInput>
    create: XOR<ContentEntryCreateWithoutTypeInput, ContentEntryUncheckedCreateWithoutTypeInput>
  }

  export type ContentEntryUpdateWithWhereUniqueWithoutTypeInput = {
    where: ContentEntryWhereUniqueInput
    data: XOR<ContentEntryUpdateWithoutTypeInput, ContentEntryUncheckedUpdateWithoutTypeInput>
  }

  export type ContentEntryUpdateManyWithWhereWithoutTypeInput = {
    where: ContentEntryScalarWhereInput
    data: XOR<ContentEntryUpdateManyMutationInput, ContentEntryUncheckedUpdateManyWithoutTypeInput>
  }

  export type ContentEntryScalarWhereInput = {
    AND?: ContentEntryScalarWhereInput | ContentEntryScalarWhereInput[]
    OR?: ContentEntryScalarWhereInput[]
    NOT?: ContentEntryScalarWhereInput | ContentEntryScalarWhereInput[]
    id?: StringFilter<"ContentEntry"> | string
    typeId?: StringFilter<"ContentEntry"> | string
    defaultLocale?: StringFilter<"ContentEntry"> | string
    createdAt?: DateTimeFilter<"ContentEntry"> | Date | string
    createdBy?: StringFilter<"ContentEntry"> | string
    deletedAt?: DateTimeNullableFilter<"ContentEntry"> | Date | string | null
  }

  export type SlugRedirectUpsertWithWhereUniqueWithoutContentTypeInput = {
    where: SlugRedirectWhereUniqueInput
    update: XOR<SlugRedirectUpdateWithoutContentTypeInput, SlugRedirectUncheckedUpdateWithoutContentTypeInput>
    create: XOR<SlugRedirectCreateWithoutContentTypeInput, SlugRedirectUncheckedCreateWithoutContentTypeInput>
  }

  export type SlugRedirectUpdateWithWhereUniqueWithoutContentTypeInput = {
    where: SlugRedirectWhereUniqueInput
    data: XOR<SlugRedirectUpdateWithoutContentTypeInput, SlugRedirectUncheckedUpdateWithoutContentTypeInput>
  }

  export type SlugRedirectUpdateManyWithWhereWithoutContentTypeInput = {
    where: SlugRedirectScalarWhereInput
    data: XOR<SlugRedirectUpdateManyMutationInput, SlugRedirectUncheckedUpdateManyWithoutContentTypeInput>
  }

  export type SlugRedirectScalarWhereInput = {
    AND?: SlugRedirectScalarWhereInput | SlugRedirectScalarWhereInput[]
    OR?: SlugRedirectScalarWhereInput[]
    NOT?: SlugRedirectScalarWhereInput | SlugRedirectScalarWhereInput[]
    id?: StringFilter<"SlugRedirect"> | string
    contentTypeId?: StringFilter<"SlugRedirect"> | string
    locale?: StringFilter<"SlugRedirect"> | string
    fromSlug?: StringFilter<"SlugRedirect"> | string
    toEntryId?: StringFilter<"SlugRedirect"> | string
    createdAt?: DateTimeFilter<"SlugRedirect"> | Date | string
  }

  export type ContentTypeCreateWithoutEntriesInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    redirects?: SlugRedirectCreateNestedManyWithoutContentTypeInput
  }

  export type ContentTypeUncheckedCreateWithoutEntriesInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    redirects?: SlugRedirectUncheckedCreateNestedManyWithoutContentTypeInput
  }

  export type ContentTypeCreateOrConnectWithoutEntriesInput = {
    where: ContentTypeWhereUniqueInput
    create: XOR<ContentTypeCreateWithoutEntriesInput, ContentTypeUncheckedCreateWithoutEntriesInput>
  }

  export type ContentVersionCreateWithoutEntryInput = {
    id?: string
    version: number
    status: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    createdBy: string
    publishedAt?: Date | string | null
    scheduledAt?: Date | string | null
  }

  export type ContentVersionUncheckedCreateWithoutEntryInput = {
    id?: string
    version: number
    status: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    createdBy: string
    publishedAt?: Date | string | null
    scheduledAt?: Date | string | null
  }

  export type ContentVersionCreateOrConnectWithoutEntryInput = {
    where: ContentVersionWhereUniqueInput
    create: XOR<ContentVersionCreateWithoutEntryInput, ContentVersionUncheckedCreateWithoutEntryInput>
  }

  export type ContentVersionCreateManyEntryInputEnvelope = {
    data: ContentVersionCreateManyEntryInput | ContentVersionCreateManyEntryInput[]
    skipDuplicates?: boolean
  }

  export type ContentLockCreateWithoutEntryInput = {
    id?: string
    lockedBy: string
    lockedAt?: Date | string
    expiresAt: Date | string
  }

  export type ContentLockUncheckedCreateWithoutEntryInput = {
    id?: string
    lockedBy: string
    lockedAt?: Date | string
    expiresAt: Date | string
  }

  export type ContentLockCreateOrConnectWithoutEntryInput = {
    where: ContentLockWhereUniqueInput
    create: XOR<ContentLockCreateWithoutEntryInput, ContentLockUncheckedCreateWithoutEntryInput>
  }

  export type SlugRedirectCreateWithoutToEntryInput = {
    id?: string
    locale: string
    fromSlug: string
    createdAt?: Date | string
    contentType: ContentTypeCreateNestedOneWithoutRedirectsInput
  }

  export type SlugRedirectUncheckedCreateWithoutToEntryInput = {
    id?: string
    contentTypeId: string
    locale: string
    fromSlug: string
    createdAt?: Date | string
  }

  export type SlugRedirectCreateOrConnectWithoutToEntryInput = {
    where: SlugRedirectWhereUniqueInput
    create: XOR<SlugRedirectCreateWithoutToEntryInput, SlugRedirectUncheckedCreateWithoutToEntryInput>
  }

  export type SlugRedirectCreateManyToEntryInputEnvelope = {
    data: SlugRedirectCreateManyToEntryInput | SlugRedirectCreateManyToEntryInput[]
    skipDuplicates?: boolean
  }

  export type ContentTypeUpsertWithoutEntriesInput = {
    update: XOR<ContentTypeUpdateWithoutEntriesInput, ContentTypeUncheckedUpdateWithoutEntriesInput>
    create: XOR<ContentTypeCreateWithoutEntriesInput, ContentTypeUncheckedCreateWithoutEntriesInput>
    where?: ContentTypeWhereInput
  }

  export type ContentTypeUpdateToOneWithWhereWithoutEntriesInput = {
    where?: ContentTypeWhereInput
    data: XOR<ContentTypeUpdateWithoutEntriesInput, ContentTypeUncheckedUpdateWithoutEntriesInput>
  }

  export type ContentTypeUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redirects?: SlugRedirectUpdateManyWithoutContentTypeNestedInput
  }

  export type ContentTypeUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    redirects?: SlugRedirectUncheckedUpdateManyWithoutContentTypeNestedInput
  }

  export type ContentVersionUpsertWithWhereUniqueWithoutEntryInput = {
    where: ContentVersionWhereUniqueInput
    update: XOR<ContentVersionUpdateWithoutEntryInput, ContentVersionUncheckedUpdateWithoutEntryInput>
    create: XOR<ContentVersionCreateWithoutEntryInput, ContentVersionUncheckedCreateWithoutEntryInput>
  }

  export type ContentVersionUpdateWithWhereUniqueWithoutEntryInput = {
    where: ContentVersionWhereUniqueInput
    data: XOR<ContentVersionUpdateWithoutEntryInput, ContentVersionUncheckedUpdateWithoutEntryInput>
  }

  export type ContentVersionUpdateManyWithWhereWithoutEntryInput = {
    where: ContentVersionScalarWhereInput
    data: XOR<ContentVersionUpdateManyMutationInput, ContentVersionUncheckedUpdateManyWithoutEntryInput>
  }

  export type ContentVersionScalarWhereInput = {
    AND?: ContentVersionScalarWhereInput | ContentVersionScalarWhereInput[]
    OR?: ContentVersionScalarWhereInput[]
    NOT?: ContentVersionScalarWhereInput | ContentVersionScalarWhereInput[]
    id?: StringFilter<"ContentVersion"> | string
    entryId?: StringFilter<"ContentVersion"> | string
    version?: IntFilter<"ContentVersion"> | number
    status?: StringFilter<"ContentVersion"> | string
    data?: JsonFilter<"ContentVersion">
    createdAt?: DateTimeFilter<"ContentVersion"> | Date | string
    createdBy?: StringFilter<"ContentVersion"> | string
    publishedAt?: DateTimeNullableFilter<"ContentVersion"> | Date | string | null
    scheduledAt?: DateTimeNullableFilter<"ContentVersion"> | Date | string | null
  }

  export type ContentLockUpsertWithoutEntryInput = {
    update: XOR<ContentLockUpdateWithoutEntryInput, ContentLockUncheckedUpdateWithoutEntryInput>
    create: XOR<ContentLockCreateWithoutEntryInput, ContentLockUncheckedCreateWithoutEntryInput>
    where?: ContentLockWhereInput
  }

  export type ContentLockUpdateToOneWithWhereWithoutEntryInput = {
    where?: ContentLockWhereInput
    data: XOR<ContentLockUpdateWithoutEntryInput, ContentLockUncheckedUpdateWithoutEntryInput>
  }

  export type ContentLockUpdateWithoutEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockedBy?: StringFieldUpdateOperationsInput | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentLockUncheckedUpdateWithoutEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockedBy?: StringFieldUpdateOperationsInput | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlugRedirectUpsertWithWhereUniqueWithoutToEntryInput = {
    where: SlugRedirectWhereUniqueInput
    update: XOR<SlugRedirectUpdateWithoutToEntryInput, SlugRedirectUncheckedUpdateWithoutToEntryInput>
    create: XOR<SlugRedirectCreateWithoutToEntryInput, SlugRedirectUncheckedCreateWithoutToEntryInput>
  }

  export type SlugRedirectUpdateWithWhereUniqueWithoutToEntryInput = {
    where: SlugRedirectWhereUniqueInput
    data: XOR<SlugRedirectUpdateWithoutToEntryInput, SlugRedirectUncheckedUpdateWithoutToEntryInput>
  }

  export type SlugRedirectUpdateManyWithWhereWithoutToEntryInput = {
    where: SlugRedirectScalarWhereInput
    data: XOR<SlugRedirectUpdateManyMutationInput, SlugRedirectUncheckedUpdateManyWithoutToEntryInput>
  }

  export type ContentEntryCreateWithoutVersionsInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    type: ContentTypeCreateNestedOneWithoutEntriesInput
    lock?: ContentLockCreateNestedOneWithoutEntryInput
    redirects?: SlugRedirectCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryUncheckedCreateWithoutVersionsInput = {
    id?: string
    typeId: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    lock?: ContentLockUncheckedCreateNestedOneWithoutEntryInput
    redirects?: SlugRedirectUncheckedCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryCreateOrConnectWithoutVersionsInput = {
    where: ContentEntryWhereUniqueInput
    create: XOR<ContentEntryCreateWithoutVersionsInput, ContentEntryUncheckedCreateWithoutVersionsInput>
  }

  export type ContentEntryUpsertWithoutVersionsInput = {
    update: XOR<ContentEntryUpdateWithoutVersionsInput, ContentEntryUncheckedUpdateWithoutVersionsInput>
    create: XOR<ContentEntryCreateWithoutVersionsInput, ContentEntryUncheckedCreateWithoutVersionsInput>
    where?: ContentEntryWhereInput
  }

  export type ContentEntryUpdateToOneWithWhereWithoutVersionsInput = {
    where?: ContentEntryWhereInput
    data: XOR<ContentEntryUpdateWithoutVersionsInput, ContentEntryUncheckedUpdateWithoutVersionsInput>
  }

  export type ContentEntryUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    type?: ContentTypeUpdateOneRequiredWithoutEntriesNestedInput
    lock?: ContentLockUpdateOneWithoutEntryNestedInput
    redirects?: SlugRedirectUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lock?: ContentLockUncheckedUpdateOneWithoutEntryNestedInput
    redirects?: SlugRedirectUncheckedUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryCreateWithoutLockInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    type: ContentTypeCreateNestedOneWithoutEntriesInput
    versions?: ContentVersionCreateNestedManyWithoutEntryInput
    redirects?: SlugRedirectCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryUncheckedCreateWithoutLockInput = {
    id?: string
    typeId: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    versions?: ContentVersionUncheckedCreateNestedManyWithoutEntryInput
    redirects?: SlugRedirectUncheckedCreateNestedManyWithoutToEntryInput
  }

  export type ContentEntryCreateOrConnectWithoutLockInput = {
    where: ContentEntryWhereUniqueInput
    create: XOR<ContentEntryCreateWithoutLockInput, ContentEntryUncheckedCreateWithoutLockInput>
  }

  export type ContentEntryUpsertWithoutLockInput = {
    update: XOR<ContentEntryUpdateWithoutLockInput, ContentEntryUncheckedUpdateWithoutLockInput>
    create: XOR<ContentEntryCreateWithoutLockInput, ContentEntryUncheckedCreateWithoutLockInput>
    where?: ContentEntryWhereInput
  }

  export type ContentEntryUpdateToOneWithWhereWithoutLockInput = {
    where?: ContentEntryWhereInput
    data: XOR<ContentEntryUpdateWithoutLockInput, ContentEntryUncheckedUpdateWithoutLockInput>
  }

  export type ContentEntryUpdateWithoutLockInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    type?: ContentTypeUpdateOneRequiredWithoutEntriesNestedInput
    versions?: ContentVersionUpdateManyWithoutEntryNestedInput
    redirects?: SlugRedirectUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryUncheckedUpdateWithoutLockInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versions?: ContentVersionUncheckedUpdateManyWithoutEntryNestedInput
    redirects?: SlugRedirectUncheckedUpdateManyWithoutToEntryNestedInput
  }

  export type ContentTypeCreateWithoutRedirectsInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: ContentEntryCreateNestedManyWithoutTypeInput
  }

  export type ContentTypeUncheckedCreateWithoutRedirectsInput = {
    id?: string
    name: string
    displayName: string
    description?: string | null
    version?: number
    schema: JsonNullValueInput | InputJsonValue
    localization: JsonNullValueInput | InputJsonValue
    seo: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    entries?: ContentEntryUncheckedCreateNestedManyWithoutTypeInput
  }

  export type ContentTypeCreateOrConnectWithoutRedirectsInput = {
    where: ContentTypeWhereUniqueInput
    create: XOR<ContentTypeCreateWithoutRedirectsInput, ContentTypeUncheckedCreateWithoutRedirectsInput>
  }

  export type ContentEntryCreateWithoutRedirectsInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    type: ContentTypeCreateNestedOneWithoutEntriesInput
    versions?: ContentVersionCreateNestedManyWithoutEntryInput
    lock?: ContentLockCreateNestedOneWithoutEntryInput
  }

  export type ContentEntryUncheckedCreateWithoutRedirectsInput = {
    id?: string
    typeId: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
    versions?: ContentVersionUncheckedCreateNestedManyWithoutEntryInput
    lock?: ContentLockUncheckedCreateNestedOneWithoutEntryInput
  }

  export type ContentEntryCreateOrConnectWithoutRedirectsInput = {
    where: ContentEntryWhereUniqueInput
    create: XOR<ContentEntryCreateWithoutRedirectsInput, ContentEntryUncheckedCreateWithoutRedirectsInput>
  }

  export type ContentTypeUpsertWithoutRedirectsInput = {
    update: XOR<ContentTypeUpdateWithoutRedirectsInput, ContentTypeUncheckedUpdateWithoutRedirectsInput>
    create: XOR<ContentTypeCreateWithoutRedirectsInput, ContentTypeUncheckedCreateWithoutRedirectsInput>
    where?: ContentTypeWhereInput
  }

  export type ContentTypeUpdateToOneWithWhereWithoutRedirectsInput = {
    where?: ContentTypeWhereInput
    data: XOR<ContentTypeUpdateWithoutRedirectsInput, ContentTypeUncheckedUpdateWithoutRedirectsInput>
  }

  export type ContentTypeUpdateWithoutRedirectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: ContentEntryUpdateManyWithoutTypeNestedInput
  }

  export type ContentTypeUncheckedUpdateWithoutRedirectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    schema?: JsonNullValueInput | InputJsonValue
    localization?: JsonNullValueInput | InputJsonValue
    seo?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: ContentEntryUncheckedUpdateManyWithoutTypeNestedInput
  }

  export type ContentEntryUpsertWithoutRedirectsInput = {
    update: XOR<ContentEntryUpdateWithoutRedirectsInput, ContentEntryUncheckedUpdateWithoutRedirectsInput>
    create: XOR<ContentEntryCreateWithoutRedirectsInput, ContentEntryUncheckedCreateWithoutRedirectsInput>
    where?: ContentEntryWhereInput
  }

  export type ContentEntryUpdateToOneWithWhereWithoutRedirectsInput = {
    where?: ContentEntryWhereInput
    data: XOR<ContentEntryUpdateWithoutRedirectsInput, ContentEntryUncheckedUpdateWithoutRedirectsInput>
  }

  export type ContentEntryUpdateWithoutRedirectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    type?: ContentTypeUpdateOneRequiredWithoutEntriesNestedInput
    versions?: ContentVersionUpdateManyWithoutEntryNestedInput
    lock?: ContentLockUpdateOneWithoutEntryNestedInput
  }

  export type ContentEntryUncheckedUpdateWithoutRedirectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    typeId?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versions?: ContentVersionUncheckedUpdateManyWithoutEntryNestedInput
    lock?: ContentLockUncheckedUpdateOneWithoutEntryNestedInput
  }

  export type UserRoleCreateWithoutRoleInput = {
    userId: string
    assignedAt?: Date | string
    assignedBy: string
  }

  export type UserRoleUncheckedCreateWithoutRoleInput = {
    userId: string
    assignedAt?: Date | string
    assignedBy: string
  }

  export type UserRoleCreateOrConnectWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    create: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput>
  }

  export type UserRoleCreateManyRoleInputEnvelope = {
    data: UserRoleCreateManyRoleInput | UserRoleCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserRoleUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    update: XOR<UserRoleUpdateWithoutRoleInput, UserRoleUncheckedUpdateWithoutRoleInput>
    create: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput>
  }

  export type UserRoleUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    data: XOR<UserRoleUpdateWithoutRoleInput, UserRoleUncheckedUpdateWithoutRoleInput>
  }

  export type UserRoleUpdateManyWithWhereWithoutRoleInput = {
    where: UserRoleScalarWhereInput
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyWithoutRoleInput>
  }

  export type UserRoleScalarWhereInput = {
    AND?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
    OR?: UserRoleScalarWhereInput[]
    NOT?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
    userId?: StringFilter<"UserRole"> | string
    roleId?: StringFilter<"UserRole"> | string
    assignedAt?: DateTimeFilter<"UserRole"> | Date | string
    assignedBy?: StringFilter<"UserRole"> | string
  }

  export type RoleCreateWithoutUsersInput = {
    id?: string
    name: string
    displayName: string
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    displayName: string
    permissions: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleCreateOrConnectWithoutUsersInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
  }

  export type RoleUpsertWithoutUsersInput = {
    update: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUsersInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    permissions?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentEntryCreateManyTypeInput = {
    id?: string
    defaultLocale?: string
    createdAt?: Date | string
    createdBy: string
    deletedAt?: Date | string | null
  }

  export type SlugRedirectCreateManyContentTypeInput = {
    id?: string
    locale: string
    fromSlug: string
    toEntryId: string
    createdAt?: Date | string
  }

  export type ContentEntryUpdateWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versions?: ContentVersionUpdateManyWithoutEntryNestedInput
    lock?: ContentLockUpdateOneWithoutEntryNestedInput
    redirects?: SlugRedirectUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryUncheckedUpdateWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    versions?: ContentVersionUncheckedUpdateManyWithoutEntryNestedInput
    lock?: ContentLockUncheckedUpdateOneWithoutEntryNestedInput
    redirects?: SlugRedirectUncheckedUpdateManyWithoutToEntryNestedInput
  }

  export type ContentEntryUncheckedUpdateManyWithoutTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SlugRedirectUpdateWithoutContentTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    toEntry?: ContentEntryUpdateOneRequiredWithoutRedirectsNestedInput
  }

  export type SlugRedirectUncheckedUpdateWithoutContentTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    toEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlugRedirectUncheckedUpdateManyWithoutContentTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    toEntryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContentVersionCreateManyEntryInput = {
    id?: string
    version: number
    status: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    createdBy: string
    publishedAt?: Date | string | null
    scheduledAt?: Date | string | null
  }

  export type SlugRedirectCreateManyToEntryInput = {
    id?: string
    contentTypeId: string
    locale: string
    fromSlug: string
    createdAt?: Date | string
  }

  export type ContentVersionUpdateWithoutEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentVersionUncheckedUpdateWithoutEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ContentVersionUncheckedUpdateManyWithoutEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SlugRedirectUpdateWithoutToEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contentType?: ContentTypeUpdateOneRequiredWithoutRedirectsNestedInput
  }

  export type SlugRedirectUncheckedUpdateWithoutToEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentTypeId?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlugRedirectUncheckedUpdateManyWithoutToEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentTypeId?: StringFieldUpdateOperationsInput | string
    locale?: StringFieldUpdateOperationsInput | string
    fromSlug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRoleCreateManyRoleInput = {
    userId: string
    assignedAt?: Date | string
    assignedBy: string
  }

  export type UserRoleUpdateWithoutRoleInput = {
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleUncheckedUpdateWithoutRoleInput = {
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleUncheckedUpdateManyWithoutRoleInput = {
    userId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedBy?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}