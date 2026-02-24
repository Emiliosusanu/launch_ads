begin;

create extension if not exists pgcrypto;

create table if not exists public."account_scrape_status" (
  "user_id" uuid not null,
  "account_id" uuid not null,
  "machine_id" text,
  "overall_state" text default 'unknown' not null,
  "kdp_state" text default 'unknown' not null,
  "ads_state" text default 'unknown' not null,
  "last_ok_at" timestamptz,
  "last_error_at" timestamptz,
  "last_error" text,
  "last_update_at" timestamptz default now() not null,
  "created_at" timestamptz default now() not null,
  "heartbeat_at" timestamptz,
  "last_kdp_started_at" timestamptz,
  "last_kdp_finished_at" timestamptz,
  "last_kdp_duration_ms" bigint,
  "last_ads_started_at" timestamptz,
  "last_ads_finished_at" timestamptz,
  "last_ads_duration_ms" bigint,
  constraint "account_scrape_status_pkey" primary key ("user_id", "account_id")
);

create table if not exists public."admin_logs" (
  "id" uuid default gen_random_uuid() not null,
  "admin_email" text not null,
  "action_type" text not null,
  "target_user_email" text,
  "details" text,
  "created_at" timestamptz default timezone('utc'::text, now()) not null,
  constraint "admin_logs_pkey" primary key ("id")
);

create table if not exists public."admin_users" (
  "user_id" uuid not null,
  "created_at" timestamptz default now() not null,
  constraint "admin_users_pkey" primary key ("user_id")
);

create table if not exists public."ADSPILOT_name" (
  "id" uuid default gen_random_uuid() not null,
  "email" text not null,
  "joined_date" timestamptz default now(),
  "beta_status" text default 'pending',
  "email_sent" boolean default false,
  "welcome_email_sent" boolean default false,
  "feature_email_sent" boolean default false,
  "urgency_email_sent" boolean default false,
  "notes" text,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  "approval_status" text default 'pending',
  "admin_message" text,
  "user_message" text,
  "last_message_date" timestamptz,
  "is_admin" boolean default false,
  "full_name" text,
  "company" text,
  "phone" text,
  "website" text,
  "bio" text,
  "profile_updated_at" timestamptz,
  constraint "ADSPILOT_name_pkey" primary key ("id")
);

create table if not exists public."api_keys" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "api_key" text not null,
  "service" text not null,
  "status" text default 'active' not null,
  "usage_count" integer default 0 not null,
  "credits" integer default 1000 not null,
  "max_credits" integer default 1000 not null,
  "cost_per_call" integer default 1 not null,
  "last_used_at" timestamptz,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz default now() not null,
  constraint "api_keys_pkey" primary key ("id")
);

create table if not exists public."app_downloads" (
  "id" uuid default gen_random_uuid() not null,
  "app_key" text not null,
  "platform" text not null,
  "version" text not null,
  "url" text not null,
  "created_by" uuid,
  "created_at" timestamptz default now() not null,
  "label" text,
  "notes" text,
  constraint "app_downloads_pkey" primary key ("id")
);

create table if not exists public."app_licenses" (
  "id" uuid default gen_random_uuid() not null,
  "license_key" text not null,
  "status" text default 'inactive' not null,
  "user_id" uuid,
  "created_at" timestamptz default timezone('utc'::text, now()),
  "expires_at" timestamptz,
  "metadata" jsonb,
  "visitor_id" uuid,
  constraint "app_licenses_pkey" primary key ("id")
);

create table if not exists public."app_settings" (
  "id" uuid default gen_random_uuid() not null,
  "setting_key" text not null,
  "setting_value" text,
  "description" text,
  "updated_at" timestamptz default timezone('utc'::text, now()),
  constraint "app_settings_pkey" primary key ("id")
);

create table if not exists public."asin_daily_metrics" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin_data_id" uuid not null,
  "asin" text not null,
  "country" text not null,
  "day" date not null,
  "bsr" integer,
  "price" numeric,
  "review_count" integer,
  "rating" numeric,
  "availability_code" text,
  "stock_status" text,
  "sales_est_low" integer,
  "sales_est_high" integer,
  "revenue_est_low" numeric,
  "revenue_est_high" numeric,
  "created_at" timestamptz default now() not null,
  constraint "asin_daily_metrics_pkey" primary key ("id")
);

create table if not exists public."asin_data" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin" text not null,
  "title" text,
  "subtitle" text,
  "author" text,
  "price" numeric,
  "review_count" integer,
  "rating" numeric,
  "availability" boolean,
  "bsr" integer,
  "image_url" text,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  "royalty" numeric default 0,
  "country" text,
  "is_bestseller" boolean default false,
  "publication_date" date,
  "stock_status" text,
  "availability_code" text,
  "bestseller_category" text,
  "is_bestseller_miss_count" integer default 0,
  "page_count" integer,
  "dimensions_raw" text,
  "trim_size" text,
  "binding" text,
  "language" text,
  "series" text,
  "category" text,
  "interior_type" text,
  "interior_confidence" real,
  "interior_detected" boolean,
  "archived" boolean default false not null,
  "archived_at" timestamptz,
  "price_source" text,
  "price_missing_reason" text,
  "list_price" numeric,
  "discount_percent" integer,
  "discount_amount" numeric,
  "is_green_in_stock" boolean default false,
  "paperback_price_text" text,
  "paperback_price_source" text,
  "any_price_text" text,
  "is_great_on_kindle" boolean,
  constraint "asin_data_pkey" primary key ("id")
);

create table if not exists public."asin_events" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin_data_id" uuid not null,
  "event_type" text not null,
  "description" text not null,
  "metadata" jsonb,
  "created_at" timestamptz default now() not null,
  "notified_email_at" timestamptz,
  constraint "asin_events_pkey" primary key ("id")
);

create table if not exists public."asin_history" (
  "id" uuid default gen_random_uuid() not null,
  "asin_data_id" uuid not null,
  "user_id" uuid not null,
  "asin" text not null,
  "price" numeric,
  "review_count" integer,
  "rating" numeric,
  "bsr" integer,
  "availability" boolean,
  "created_at" timestamptz default now(),
  "price_source" text,
  "price_missing_reason" text,
  "stock_status" text,
  "availability_code" text,
  "list_price" numeric,
  "discount_percent" integer,
  "discount_amount" numeric,
  "is_green_in_stock" boolean,
  constraint "asin_history_pkey" primary key ("id")
);

create table if not exists public."asin_history_backup" (
  "id" uuid,
  "asin_data_id" uuid,
  "user_id" uuid,
  "asin" text,
  "price" numeric,
  "review_count" integer,
  "rating" numeric,
  "bsr" integer,
  "availability" boolean,
  "created_at" timestamptz
);

create table if not exists public."asin_peers" (
  "user_id" uuid not null,
  "asin_data_id" uuid not null,
  "peer_asin_data_id" uuid not null,
  "score" numeric not null,
  "created_at" timestamptz default now() not null,
  constraint "asin_peers_pkey" primary key ("asin_data_id", "peer_asin_data_id")
);

create table if not exists public."audit_logs" (
  "id" uuid,
  "payload" json,
  "created_at" timestamptz,
  "ip_address" varchar,
  constraint "audit_logs_pkey" primary key ("id")
);

create table if not exists public."books" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "title" text not null,
  "subtitle" text,
  "author" text,
  "description" text,
  "keywords" text[],
  "categories" text[],
  "links" jsonb,
  "cover_image_url" text,
  "status" text default 'Idea' not null,
  "notes" text,
  "created_at" timestamptz default timezone('utc'::text, now()) not null,
  "updated_at" timestamptz default timezone('utc'::text, now()) not null,
  constraint "books_pkey" primary key ("id")
);

create table if not exists public."bsr_history" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin" text not null,
  "bsr" integer,
  "scraped_at" timestamptz default timezone('utc'::text, now()),
  "created_at" timestamptz default now(),
  "price" numeric,
  "review_count" integer,
  "scraped_book_data_id" uuid,
  "updated_at" timestamptz default now(),
  constraint "bsr_history_pkey" primary key ("id")
);

create table if not exists public."category_baselines" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "country" text not null,
  "category" text not null,
  "day" date not null,
  "bsr_p20" integer,
  "bsr_p50" integer,
  "bsr_p80" integer,
  "price_p50" numeric,
  "volume_index" numeric,
  "created_at" timestamptz default now() not null,
  constraint "category_baselines_pkey" primary key ("id")
);

create table if not exists public."crm_activity_logs" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid,
  "user_name" text,
  "action" text not null,
  "details" text,
  "timestamp" timestamptz default now(),
  "created_at" timestamptz default now(),
  constraint "crm_activity_logs_pkey" primary key ("id")
);

create table if not exists public."crm_daily_activity" (
  "id" uuid default gen_random_uuid() not null,
  "date" date not null,
  "entries" integer default 0,
  "active_users" integer default 0,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  constraint "crm_daily_activity_pkey" primary key ("id")
);

create table if not exists public."crm_financial_data" (
  "id" uuid default gen_random_uuid() not null,
  "month" text not null,
  "year" integer not null,
  "income" numeric default 0,
  "spending" numeric default 0,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  constraint "crm_financial_data_pkey" primary key ("id")
);

create table if not exists public."crm_users" (
  "id" uuid default gen_random_uuid() not null,
  "name" text not null,
  "email" text not null,
  "role" text,
  "status" text default 'active',
  "last_active" timestamptz default now(),
  "activity_score" integer default 0,
  "avatar_url" text,
  "entries" integer default 0,
  "joined_at" timestamptz default now(),
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  constraint "crm_users_pkey" primary key ("id")
);

create table if not exists public."download_apps" (
  "app_key" text not null,
  "display_name" text not null,
  "description" text,
  "tag" text,
  "sort_order" integer default 0 not null,
  "created_by" uuid,
  "created_at" timestamptz default now() not null,
  "instructions" text,
  "mac_description" text,
  "windows_description" text,
  "linux_description" text,
  constraint "download_apps_pkey" primary key ("app_key")
);

create table if not exists public."email_alert_log" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin" text,
  "alert_type" text not null,
  "dedupe_key" text not null,
  "created_at" timestamptz default now() not null,
  constraint "email_alert_log_pkey" primary key ("id")
);

create table if not exists public."expense_subscription_periods" (
  "id" uuid default gen_random_uuid() not null,
  "subscription_id" uuid not null,
  "start_date" date not null,
  "end_date" date not null,
  "created_at" timestamptz default now() not null,
  constraint "expense_subscription_periods_pkey" primary key ("id")
);

create table if not exists public."expense_subscriptions" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "description" text not null,
  "amount" numeric not null,
  "currency" text default 'EUR' not null,
  "planned_months" integer,
  "created_at" timestamptz default now() not null,
  constraint "expense_subscriptions_pkey" primary key ("id")
);

create table if not exists public."kdp_accounts" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid(),
  "name" text not null,
  "color" text default '#FFFFFF',
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  "is_archived" boolean default false,
  "notes" text,
  "links" jsonb,
  "amazon_marketplace" text,
  "machine_id" text,
  "region" text,
  "connection_status" text default 'not_configured' not null,
  "last_successful_sync" timestamptz,
  constraint "kdp_accounts_pkey" primary key ("id")
);

create table if not exists public."kdp_book_daily_data" (
  "account_id" uuid not null,
  "date" date not null,
  "asin" text not null,
  "group_key" text,
  "royalties" numeric default 0 not null,
  "orders" integer default 0 not null,
  "ebook_orders" integer default 0 not null,
  "paperback_orders" integer default 0 not null,
  "kenp" integer default 0 not null,
  "ebook_royalties" numeric default 0 not null,
  "paperback_royalties" numeric default 0 not null,
  "kenp_royalties" numeric default 0 not null,
  "updated_at" timestamptz default now() not null,
  constraint "kdp_book_daily_data_pkey" primary key ("account_id", "date", "asin")
);

create table if not exists public."kdp_book_formats" (
  "account_id" uuid not null,
  "id" text not null,
  "book_id" text not null,
  "asin" text not null,
  "format" text,
  "marketplace" text,
  "created_at" timestamptz default now() not null,
  constraint "kdp_book_formats_pkey" primary key ("account_id", "id")
);

create table if not exists public."kdp_books" (
  "account_id" uuid not null,
  "id" text not null,
  "normalized_title" text not null,
  "display_title" text,
  "author" text,
  "language" text,
  "cover_url" text,
  "cover_path" text,
  "created_at" timestamptz default now() not null,
  constraint "kdp_books_pkey" primary key ("account_id", "id")
);

create table if not exists public."kdp_daily_data" (
  "account_id" uuid not null,
  "date" date not null,
  "royalties" numeric default 0 not null,
  "orders" integer default 0 not null,
  "kenp" integer default 0 not null,
  "updated_at" timestamptz default now() not null,
  constraint "kdp_daily_data_pkey" primary key ("account_id", "date")
);

create table if not exists public."kdp_daily_facts" (
  "account_id" uuid not null,
  "date" date not null,
  "asin" text not null,
  "format" text not null,
  "marketplace" text not null,
  "units" integer default 0 not null,
  "royalties" numeric default 0 not null,
  "kenp" integer default 0 not null,
  "currency" text,
  "is_estimated" boolean default false not null,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz default now() not null,
  "revision_id" uuid,
  "format_key" text,
  "marketplace_key" text,
  "free_units" integer default 0 not null,
  constraint "kdp_daily_facts_pkey" primary key ("account_id", "date", "asin", "format", "marketplace")
);

create table if not exists public."kdp_entries" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid(),
  "account_id" uuid,
  "date" date not null,
  "income" numeric not null,
  "income_currency" text default 'EUR' not null,
  "ad_spend" numeric default 0 not null,
  "ad_spend_currency" text default 'USD' not null,
  "created_at" timestamptz default now(),
  "eur_to_usd_rate_at_entry" numeric,
  "updated_at" timestamptz default now(),
  "ad_acos" numeric,
  "duration_ms" bigint,
  "orders" bigint,
  "kenp" bigint,
  "ad_orders" bigint,
  "ad_impressions" bigint,
  constraint "kdp_entries_pkey" primary key ("id")
);

create table if not exists public."kdp_scraper_settings" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid,
  "account_id" uuid not null,
  "frequency" text default 'daily' not null,
  "kdp_email" text,
  "kdp_password" text,
  "amazon_email" text,
  "amazon_password" text,
  "last_successful_scrape" timestamptz,
  "next_scheduled_scrape" timestamptz,
  "kdp_cookies" jsonb,
  "amazon_cookies" jsonb,
  "created_at" timestamptz default timezone('utc'::text, now()),
  "updated_at" timestamptz default timezone('utc'::text, now()),
  "scrape_mode" text default 'yesterday' not null,
  "scrape_minute" smallint,
  "scrape_hour" smallint,
  "scrape_days_of_week" smallint[],
  "scrape_timezone" text,
  constraint "kdp_scraper_settings_pkey" primary key ("id")
);

create table if not exists public."kdp_sync_revisions" (
  "id" uuid default gen_random_uuid() not null,
  "account_id" uuid not null,
  "run_id" uuid,
  "run_type" text not null,
  "start_date" date,
  "end_date" date,
  "raw_payload_path" text,
  "accepted" boolean default false not null,
  "created_at" timestamptz default now() not null,
  constraint "kdp_sync_revisions_pkey" primary key ("id")
);

create table if not exists public."kdp_sync_row_errors" (
  "id" uuid default gen_random_uuid() not null,
  "account_id" uuid not null,
  "revision_id" uuid not null,
  "reason" text not null,
  "raw_json" jsonb,
  "created_at" timestamptz default now() not null,
  constraint "kdp_sync_row_errors_pkey" primary key ("id")
);

create table if not exists public."kdp_sync_runs" (
  "id" uuid default gen_random_uuid() not null,
  "account_id" uuid not null,
  "run_type" text not null,
  "start_date" date,
  "end_date" date,
  "status" text default 'queued' not null,
  "error_message" text,
  "started_at" timestamptz,
  "finished_at" timestamptz,
  "created_at" timestamptz default now() not null,
  constraint "kdp_sync_runs_pkey" primary key ("id")
);

create table if not exists public."kdp_titles" (
  "account_id" uuid not null,
  "asin" text not null,
  "title" text,
  "author" text,
  "cover_url" text,
  "updated_at" timestamptz default now() not null,
  constraint "kdp_titles_pkey" primary key ("account_id", "asin")
);

create table if not exists public."kdp_top_books_month" (
  "account_id" uuid not null,
  "month" text not null,
  "rank" integer not null,
  "title" text not null,
  "cover_url" text,
  "royalties_text" text,
  "orders" integer,
  "pages" integer,
  "updated_at" timestamptz default now() not null,
  constraint "kdp_top_books_month_pkey" primary key ("account_id", "month", "rank")
);

create table if not exists public."kdp_tracked_books" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid,
  "asin" text not null,
  "title" text not null,
  "category" text,
  "price" numeric,
  "review_count" integer,
  "rating" numeric,
  "current_bsr" integer,
  "stock_status" text,
  "trend_data" jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  constraint "kdp_tracked_books_pkey" primary key ("id")
);

create table if not exists public."leaderboard_user_settings" (
  "user_id" uuid not null,
  "is_hidden" boolean default false not null,
  "updated_at" timestamptz default now() not null,
  constraint "leaderboard_user_settings_pkey" primary key ("user_id")
);

create table if not exists public."managed_accounts" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "account_name" text not null,
  "category" text,
  "username_email" text,
  "password" text,
  "website_url" text,
  "notes" text,
  "security_questions" jsonb,
  "tags" jsonb,
  "created_at" timestamptz default timezone('utc'::text, now()) not null,
  "updated_at" timestamptz default timezone('utc'::text, now()) not null,
  constraint "managed_accounts_pkey" primary key ("id")
);

create table if not exists public."messages" (
  "id" uuid default gen_random_uuid() not null,
  "sender_email" text not null,
  "receiver_email" text not null,
  "message_text" text not null,
  "created_at" timestamptz default timezone('utc'::text, now()) not null,
  "read_status" boolean default false,
  "conversation_id" text,
  "read_at" timestamptz,
  constraint "messages_pkey" primary key ("id")
);

create table if not exists public."notification_daily_rollup" (
  "id" uuid default gen_random_uuid() not null,
  "asin" text not null,
  "user_id" uuid not null,
  "date" date not null,
  "better" integer default 0 not null,
  "worse" integer default 0 not null,
  "stable" integer default 0 not null,
  "net_impact_avg" numeric default 0 not null,
  "weights" jsonb,
  constraint "notification_daily_rollup_pkey" primary key ("id")
);

create table if not exists public."notification_events" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin_data_id" uuid,
  "rule_id" uuid,
  "severity" text default 'info' not null,
  "title" text not null,
  "body_md" text not null,
  "channel" text default 'inapp' not null,
  "dedupe_key" text,
  "status" text default 'queued' not null,
  "created_at" timestamptz default now() not null,
  "delivered_at" timestamptz,
  constraint "notification_events_pkey" primary key ("id")
);

create table if not exists public."notification_feedback" (
  "id" uuid default gen_random_uuid() not null,
  "asin" text not null,
  "user_id" uuid not null,
  "notification_id" uuid not null,
  "action" text not null,
  "created_at" timestamptz default now() not null,
  constraint "notification_feedback_pkey" primary key ("id")
);

create table if not exists public."notification_rules" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "name" text not null,
  "rule_type" text not null,
  "condition" jsonb not null,
  "cooloff_seconds" integer default 21600,
  "channels" text[] not null,
  "enabled" boolean default true not null,
  "created_at" timestamptz default now() not null,
  constraint "notification_rules_pkey" primary key ("id")
);

create table if not exists public."notification_snapshots" (
  "id" uuid default gen_random_uuid() not null,
  "asin" text not null,
  "user_id" uuid not null,
  "status" text not null,
  "net_impact" numeric default 0 not null,
  "sentiment" text not null,
  "drivers" jsonb not null,
  "confidence" text not null,
  "details" jsonb not null,
  "algo_version" text default 'v1' not null,
  "created_at" timestamptz default now() not null,
  "recommendations" jsonb not null,
  constraint "notification_snapshots_pkey" primary key ("id")
);

create table if not exists public."optimization_settings" (
  "setting_key" text not null,
  "category" text not null,
  "value" jsonb not null,
  "label" text not null,
  "description" text,
  "updated_at" timestamptz default timezone('utc'::text, now()),
  constraint "optimization_settings_pkey" primary key ("setting_key")
);

create table if not exists public."other_expenses" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "date" date not null,
  "description" text not null,
  "amount" numeric not null,
  "currency" text not null,
  "created_at" timestamptz default timezone('utc'::text, now()) not null,
  "eur_to_usd_rate_at_expense" numeric,
  "subscription_id" uuid,
  constraint "other_expenses_pkey" primary key ("id")
);

create table if not exists public."performance_snapshots" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin_data_id" uuid not null,
  "asin" text not null,
  "country" text not null,
  "day" date not null,
  "qi_score" smallint,
  "baseline_percentile" numeric,
  "volatility_30" numeric,
  "momentum_7" numeric,
  "elasticity_est" numeric,
  "notes" text,
  "created_at" timestamptz default now() not null,
  constraint "performance_snapshots_pkey" primary key ("id")
);

create table if not exists public."profiles" (
  "id" uuid not null,
  "display_name" text,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  "stripe_customer_id" text,
  "subscription_status" text,
  "subscription_id" text,
  "trial_ends_at" timestamptz,
  "current_period_ends_at" timestamptz,
  "settings_gbtio" jsonb,
  "active_license_key" text,
  "is_admin" boolean default false,
  constraint "profiles_pkey" primary key ("id")
);

create table if not exists public."push_notification_queue" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin_data_id" uuid,
  "asin" text not null,
  "title" text,
  "change_type" text not null,
  "message" text not null,
  "payload" jsonb not null,
  "status" text default 'pending' not null,
  "retry_count" integer default 0 not null,
  "created_at" timestamptz default now() not null,
  "processed_at" timestamptz,
  constraint "push_notification_queue_pkey" primary key ("id")
);

create table if not exists public."push_notification_tokens" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "device_token" text not null,
  "platform" text not null,
  "device_id" text,
  "enabled" boolean default true not null,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz default now() not null,
  constraint "push_notification_tokens_pkey" primary key ("id")
);

create table if not exists public."scrape_commands" (
  "id" uuid default gen_random_uuid() not null,
  "created_at" timestamptz default now() not null,
  "user_id" uuid not null,
  "account_id" uuid not null,
  "scope" text not null,
  "mode" text not null,
  "date" date,
  "dates" text[],
  "status" text default 'queued' not null,
  "machine_id" text,
  "payload" jsonb not null,
  "error" text,
  "accepted_at" timestamptz,
  "started_at" timestamptz,
  "finished_at" timestamptz,
  constraint "scrape_commands_pkey" primary key ("id")
);

create table if not exists public."scrape_runs" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid,
  "account_id" text,
  "account_name" text,
  "machine_id" text,
  "started_at" timestamptz,
  "finished_at" timestamptz,
  "duration_ms" bigint,
  "scope" text default 'kdp' not null,
  "mode" text default 'yesterday' not null,
  "success" boolean default false not null,
  "scraped_values" jsonb,
  "error_types" text[],
  "error" jsonb,
  "meta" jsonb,
  "created_at" timestamptz default now() not null,
  constraint "scrape_runs_pkey" primary key ("id")
);

create table if not exists public."scraped_book_data" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin" text not null,
  "title" text,
  "image_url" text,
  "price" numeric,
  "currency" text,
  "stock_status" text,
  "review_count" integer,
  "last_scraped_at" timestamptz default timezone('utc'::text, now()),
  "created_at" timestamptz default now(),
  "author" text,
  "rating" numeric,
  "bsr" integer,
  "updated_at" timestamptz default now(),
  "debug_raw_response" text,
  constraint "scraped_book_data_pkey" primary key ("id")
);

create table if not exists public."scraper_api_keys" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "service_name" text not null,
  "api_key" text not null,
  "status" text default 'active' not null,
  "credits" integer default 1000 not null,
  "max_credits" integer default 1000 not null,
  "success_count" integer default 0 not null,
  "failure_count" integer default 0 not null,
  "last_used_at" timestamptz,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz default now() not null,
  "cost_per_call" integer default 1 not null,
  "last_reset_at" timestamptz,
  "last_success_at" timestamptz,
  "cooldown_until" timestamptz,
  constraint "scraper_api_keys_pkey" primary key ("id")
);

create table if not exists public."scraper_api_logs" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "api_key_id" uuid not null,
  "asin" text not null,
  "country" text not null,
  "status" text not null,
  "cost" integer not null,
  "error_message" text,
  "created_at" timestamptz default now() not null,
  constraint "scraper_api_logs_pkey" primary key ("id")
);

create table if not exists public."scraper_failed_logs" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "asin" text not null,
  "country" text,
  "error_message" text,
  "timestamp" timestamptz default now() not null,
  constraint "scraper_failed_logs_pkey" primary key ("id")
);

create table if not exists public."settings" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid(),
  "eur_to_usd_rate" numeric default 1.1,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  "display_currency" text default 'EUR',
  "default_currency" text default 'EUR',
  "notification_prefs" jsonb,
  "theme" text default 'system',
  "profit_goal" numeric default 5000,
  "xp" integer default 0,
  "level" integer default 1,
  "achievements" jsonb,
  "level_up_toast_shown_for_level" integer,
  "default_ad_spend_currency" text default 'EUR',
  "display_currency_last_processed" text,
  "account_manager_pin" text,
  "sidebar_behavior_desktop" text default 'drawer',
  "sidebar_behavior_mobile" text default 'drawer',
  "auto_save_enabled" boolean default false,
  "stripe_publishable_key" text,
  "stripe_price_id_monthly" text,
  "default_account_id" uuid,
  "kdp_email" text,
  "kdp_password" text,
  "kdp_cookies" jsonb,
  "scraping_frequency" text default 'daily',
  "last_scrape_at" timestamptz,
  "default_period" text default 'yesterday',
  "kdp_last_login" timestamptz,
  "kdp_login_status" text default 'not_logged_in',
  "scraping_interval" text default 'daily_at_12_pm',
  "ads_email" text,
  "ads_password" text,
  "ads_cookies" jsonb,
  "ads_last_login" timestamptz,
  "ads_login_status" text,
  "chrome_path" text,
  "scraperapi_key" text,
  "scraping_start_hour" integer default 8,
  "next_scrape_at" timestamptz,
  "income_withholding_percent" real default 0,
  "ad_vat_percent" real default 0,
  "subscription_plan" text,
  "kdp_log_group_by_day" boolean default false not null,
  "stock_alert_enabled" boolean default false not null,
  "stock_alert_on_change" boolean default false not null,
  "bsr_alert_enabled" boolean default false not null,
  "bsr_alert_threshold_pct" numeric default 20 not null,
  "email_alert_recipient" text,
  constraint "settings_pkey" primary key ("id")
);

create table if not exists public."subscriptions" (
  "user_id" uuid not null,
  "stripe_customer_id" text,
  "stripe_subscription_id" text,
  "status" text not null,
  "trial_starts_at" timestamptz,
  "trial_ends_at" timestamptz,
  "current_period_starts_at" timestamptz,
  "current_period_ends_at" timestamptz,
  "cancel_at_period_end" boolean default false,
  "canceled_at" timestamptz,
  "ended_at" timestamptz,
  "metadata" jsonb,
  "created_at" timestamptz default now(),
  "updated_at" timestamptz default now(),
  "stripe_session_id" text,
  "price_id" text,
  "product_id" text,
  "current_period_end" timestamptz,
  constraint "subscriptions_pkey" primary key ("user_id")
);

create table if not exists public."tips_library" (
  "id" uuid default gen_random_uuid() not null,
  "code" text not null,
  "title" text not null,
  "body_md" text not null,
  "metric_keys" text[],
  "severity" text default 'info',
  "created_at" timestamptz default now() not null,
  constraint "tips_library_pkey" primary key ("id")
);

create table if not exists public."todos" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "task" text not null,
  "is_completed" boolean default false not null,
  "due_date" date,
  "created_at" timestamptz default timezone('utc'::text, now()) not null,
  "updated_at" timestamptz default timezone('utc'::text, now()) not null,
  "notes" text,
  "links" jsonb,
  constraint "todos_pkey" primary key ("id")
);

create table if not exists public."user_settings" (
  "user_id" uuid not null,
  "timezone" text default 'UTC' not null,
  "default_currency" text default 'USD' not null,
  "marketplaces" text[] not null,
  "enable_hourly_sync" boolean default true not null,
  "hourly_sync_interval_minutes" integer default 60 not null,
  "enable_correction_sync" boolean default true not null,
  "enable_manual_sync" boolean default true not null,
  "enable_auto_onboarding_90d" boolean default false not null,
  "last_auto_correction_14d_ymd" date,
  "onboarding_status" text default 'not_started' not null,
  "dashboard_state" jsonb not null,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz default now() not null,
  "active_account_id" uuid,
  "catchup_days" integer default 7 not null,
  "last_auto_correction_7d_ymd" date,
  "data_gather_method" text default 'endpoint_replay' not null,
  constraint "user_settings_pkey" primary key ("user_id")
);

create table if not exists public."users_public" (
  "id" uuid,
  "last_sign_in_at" timestamptz,
  "created_at" timestamptz,
  "email" varchar,
  constraint "users_public_pkey" primary key ("id")
);

alter table if exists public."account_scrape_status" add constraint "account_scrape_status_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."account_scrape_status" add constraint "account_scrape_status_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."api_keys" add constraint "api_keys_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."app_licenses" add constraint "app_licenses_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."asin_daily_metrics" add constraint "asin_daily_metrics_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."asin_data" add constraint "asin_data_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."asin_events" add constraint "asin_events_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."asin_events" add constraint "asin_events_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."asin_history" add constraint "asin_history_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."asin_history" add constraint "asin_history_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."asin_peers" add constraint "asin_peers_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."asin_peers" add constraint "asin_peers_peer_asin_data_id_fkey" foreign key ("peer_asin_data_id") references public."asin_data" ("id");

alter table if exists public."books" add constraint "books_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."bsr_history" add constraint "bsr_history_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."bsr_history" add constraint "bsr_history_scraped_book_data_id_fkey" foreign key ("scraped_book_data_id") references public."scraped_book_data" ("id");

alter table if exists public."crm_activity_logs" add constraint "crm_activity_logs_user_id_fkey" foreign key ("user_id") references public."crm_users" ("id");

alter table if exists public."expense_subscription_periods" add constraint "expense_subscription_periods_subscription_id_fkey" foreign key ("subscription_id") references public."expense_subscriptions" ("id");

alter table if exists public."expense_subscriptions" add constraint "expense_subscriptions_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."kdp_accounts" add constraint "kdp_accounts_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."kdp_book_daily_data" add constraint "kdp_book_daily_data_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_book_formats" add constraint "kdp_book_formats_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_books" add constraint "kdp_books_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_daily_data" add constraint "kdp_daily_data_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_daily_facts" add constraint "kdp_daily_facts_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_entries" add constraint "kdp_entries_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."kdp_entries" add constraint "kdp_entries_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_scraper_settings" add constraint "kdp_scraper_settings_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."kdp_scraper_settings" add constraint "kdp_scraper_settings_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_sync_revisions" add constraint "kdp_sync_revisions_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_sync_revisions" add constraint "kdp_sync_revisions_run_id_fkey" foreign key ("run_id") references public."kdp_sync_runs" ("id");

alter table if exists public."kdp_sync_row_errors" add constraint "kdp_sync_row_errors_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_sync_row_errors" add constraint "kdp_sync_row_errors_revision_id_fkey" foreign key ("revision_id") references public."kdp_sync_revisions" ("id");

alter table if exists public."kdp_sync_runs" add constraint "kdp_sync_runs_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_titles" add constraint "kdp_titles_account_id_fkey" foreign key ("account_id") references public."kdp_accounts" ("id");

alter table if exists public."kdp_tracked_books" add constraint "kdp_tracked_books_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."managed_accounts" add constraint "managed_accounts_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."notification_events" add constraint "notification_events_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."notification_events" add constraint "notification_events_rule_id_fkey" foreign key ("rule_id") references public."notification_rules" ("id");

alter table if exists public."notification_feedback" add constraint "notification_feedback_notification_id_fkey" foreign key ("notification_id") references public."notification_snapshots" ("id");

alter table if exists public."other_expenses" add constraint "other_expenses_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."other_expenses" add constraint "other_expenses_subscription_id_fkey" foreign key ("subscription_id") references public."expense_subscriptions" ("id");

alter table if exists public."performance_snapshots" add constraint "performance_snapshots_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."profiles" add constraint "profiles_id_fkey" foreign key ("id") references public."users_public" ("id");

alter table if exists public."push_notification_queue" add constraint "push_notification_queue_asin_data_id_fkey" foreign key ("asin_data_id") references public."asin_data" ("id");

alter table if exists public."push_notification_tokens" add constraint "push_notification_tokens_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."scrape_commands" add constraint "scrape_commands_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."scraped_book_data" add constraint "scraped_book_data_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."scraper_api_keys" add constraint "scraper_api_keys_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."scraper_api_logs" add constraint "scraper_api_logs_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."scraper_api_logs" add constraint "scraper_api_logs_api_key_id_fkey" foreign key ("api_key_id") references public."scraper_api_keys" ("id");

alter table if exists public."scraper_failed_logs" add constraint "scraper_failed_logs_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."settings" add constraint "settings_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."settings" add constraint "settings_default_account_id_fkey" foreign key ("default_account_id") references public."kdp_accounts" ("id");

alter table if exists public."subscriptions" add constraint "subscriptions_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."todos" add constraint "todos_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."user_settings" add constraint "user_settings_user_id_fkey" foreign key ("user_id") references public."users_public" ("id");

alter table if exists public."user_settings" add constraint "user_settings_active_account_id_fkey" foreign key ("active_account_id") references public."kdp_accounts" ("id");

commit;
