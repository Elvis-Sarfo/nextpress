FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── deps: install all dependencies ───────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

# ── builder: compile the app ─────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm db:generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── runner: minimal production image ─────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy only what Next.js needs to run (standalone mode)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma client native binaries (not auto-bundled in standalone mode)
# Generator outputs to node_modules/.prisma/client (explicit output path in schema-engine)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Create uploads dir and declare as volume so Docker always treats it
# as a mount point — never an image layer. This fixes the Coolify volume issue.
RUN mkdir -p /app/public/uploads/media \
 && chown -R nextjs:nodejs /app/public/uploads
VOLUME ["/app/public/uploads/media"]

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
