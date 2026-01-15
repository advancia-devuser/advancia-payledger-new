/*
  Warnings:

  - You are about to drop the `RPAExecution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RPAWorkflow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_login_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_portfolios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_transfers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_diagrams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_generations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_learning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_monitoring_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_monitoring_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_suggestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_system_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_training_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_usage_metrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_usage_quotas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_workflow_executions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_workflows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `app_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `backup_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blockchain_verifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `board_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bot_detections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `click_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codebase_index` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `compliance_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `compliance_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consultation_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consultations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `copilot_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `copilot_interactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `copilot_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crisis_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_deposits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_price_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_withdrawals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `debit_cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diagram_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diagram_exports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diagram_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eth_activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `financial_ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fraud_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_readings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ip_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jurisdiction_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kanban_boards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kanban_columns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `market_intelligence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medbeds_bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification_preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `oal_audit_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_methods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricing_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `processor_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `push_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rewards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `risk_assessments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scam_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `security_patches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seo_audits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sitemaps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_media_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_media_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sprints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sticky_note_boards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sticky_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_dependencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `uploaded_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usage_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_crypto_balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_tiers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vault_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vault_secrets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhook_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'DOCTOR', 'MEDICAL_STAFF', 'FACILITY_ADMIN', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('NOT_STARTED', 'DOCUMENTS_UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'FROZEN', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'SEND', 'RECEIVE', 'PAYMENT', 'REFUND', 'FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BedType" AS ENUM ('GENERAL', 'ICU', 'EMERGENCY', 'MATERNITY', 'PEDIATRIC', 'SURGICAL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('APPROVE_USER', 'REJECT_USER', 'APPROVE_WITHDRAWAL', 'REJECT_WITHDRAWAL', 'SUSPEND_USER', 'ACTIVATE_USER', 'UPDATE_BALANCE', 'MANUAL_TRANSACTION', 'SYSTEM_CONFIG');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'TRANSACTION', 'APPROVAL', 'BOOKING', 'APPOINTMENT', 'PAYMENT', 'SECURITY');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED');

-- DropForeignKey
ALTER TABLE "RPAExecution" DROP CONSTRAINT "RPAExecution_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "RPAWorkflow" DROP CONSTRAINT "RPAWorkflow_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ai_diagrams" DROP CONSTRAINT "ai_diagrams_boardId_fkey";

-- DropForeignKey
ALTER TABLE "ai_diagrams" DROP CONSTRAINT "ai_diagrams_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ai_diagrams" DROP CONSTRAINT "ai_diagrams_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ai_generations" DROP CONSTRAINT "ai_generations_userId_fkey";

-- DropForeignKey
ALTER TABLE "ai_tasks" DROP CONSTRAINT "ai_tasks_executionId_fkey";

-- DropForeignKey
ALTER TABLE "ai_tasks" DROP CONSTRAINT "ai_tasks_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "ai_usage_metrics" DROP CONSTRAINT "ai_usage_metrics_userId_fkey";

-- DropForeignKey
ALTER TABLE "ai_workflow_executions" DROP CONSTRAINT "ai_workflow_executions_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_adminId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "blog_categories" DROP CONSTRAINT "blog_categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "blog_media" DROP CONSTRAINT "blog_media_postId_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "board_members" DROP CONSTRAINT "board_members_boardId_fkey";

-- DropForeignKey
ALTER TABLE "board_members" DROP CONSTRAINT "board_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "copilot_feedback" DROP CONSTRAINT "copilot_feedback_taskId_fkey";

-- DropForeignKey
ALTER TABLE "crypto_deposits" DROP CONSTRAINT "crypto_deposits_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "crypto_deposits" DROP CONSTRAINT "crypto_deposits_userId_fkey";

-- DropForeignKey
ALTER TABLE "crypto_ledger" DROP CONSTRAINT "crypto_ledger_actorId_fkey";

-- DropForeignKey
ALTER TABLE "crypto_ledger" DROP CONSTRAINT "crypto_ledger_userId_fkey";

-- DropForeignKey
ALTER TABLE "crypto_withdrawals" DROP CONSTRAINT "crypto_withdrawals_userId_fkey";

-- DropForeignKey
ALTER TABLE "diagram_comments" DROP CONSTRAINT "diagram_comments_diagramId_fkey";

-- DropForeignKey
ALTER TABLE "diagram_comments" DROP CONSTRAINT "diagram_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "diagram_exports" DROP CONSTRAINT "diagram_exports_diagramId_fkey";

-- DropForeignKey
ALTER TABLE "diagram_exports" DROP CONSTRAINT "diagram_exports_userId_fkey";

-- DropForeignKey
ALTER TABLE "diagram_members" DROP CONSTRAINT "diagram_members_diagramId_fkey";

-- DropForeignKey
ALTER TABLE "diagram_members" DROP CONSTRAINT "diagram_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "financial_ledger" DROP CONSTRAINT "financial_ledger_actorId_fkey";

-- DropForeignKey
ALTER TABLE "financial_ledger" DROP CONSTRAINT "financial_ledger_userId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "kanban_boards" DROP CONSTRAINT "kanban_boards_projectId_fkey";

-- DropForeignKey
ALTER TABLE "kanban_columns" DROP CONSTRAINT "kanban_columns_boardId_fkey";

-- DropForeignKey
ALTER TABLE "medbeds_bookings" DROP CONSTRAINT "medbeds_bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "payment_methods" DROP CONSTRAINT "payment_methods_userId_fkey";

-- DropForeignKey
ALTER TABLE "payment_subscriptions" DROP CONSTRAINT "payment_subscriptions_planId_fkey";

-- DropForeignKey
ALTER TABLE "payment_subscriptions" DROP CONSTRAINT "payment_subscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "project_tags" DROP CONSTRAINT "project_tags_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "social_media_posts" DROP CONSTRAINT "social_media_posts_accountId_fkey";

-- DropForeignKey
ALTER TABLE "social_media_posts" DROP CONSTRAINT "social_media_posts_blogPostId_fkey";

-- DropForeignKey
ALTER TABLE "sprints" DROP CONSTRAINT "sprints_projectId_fkey";

-- DropForeignKey
ALTER TABLE "sticky_note_boards" DROP CONSTRAINT "sticky_note_boards_createdById_fkey";

-- DropForeignKey
ALTER TABLE "sticky_notes" DROP CONSTRAINT "sticky_notes_boardId_fkey";

-- DropForeignKey
ALTER TABLE "sticky_notes" DROP CONSTRAINT "sticky_notes_createdById_fkey";

-- DropForeignKey
ALTER TABLE "sticky_notes" DROP CONSTRAINT "sticky_notes_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_planId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "task_attachments" DROP CONSTRAINT "task_attachments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_attachments" DROP CONSTRAINT "task_attachments_userId_fkey";

-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_comments" DROP CONSTRAINT "task_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "task_dependencies" DROP CONSTRAINT "task_dependencies_dependsOnTaskId_fkey";

-- DropForeignKey
ALTER TABLE "task_dependencies" DROP CONSTRAINT "task_dependencies_taskId_fkey";

-- DropForeignKey
ALTER TABLE "task_tags" DROP CONSTRAINT "task_tags_taskId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_boardId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_sprintId_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_taskId_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_userId_fkey";

-- DropForeignKey
ALTER TABLE "uploaded_files" DROP CONSTRAINT "uploaded_files_userId_fkey";

-- DropForeignKey
ALTER TABLE "usage_records" DROP CONSTRAINT "usage_records_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "user_crypto_balances" DROP CONSTRAINT "user_crypto_balances_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_wallets" DROP CONSTRAINT "user_wallets_userId_fkey";

-- DropTable
DROP TABLE "RPAExecution";

-- DropTable
DROP TABLE "RPAWorkflow";

-- DropTable
DROP TABLE "activity_logs";

-- DropTable
DROP TABLE "admin_login_logs";

-- DropTable
DROP TABLE "admin_portfolios";

-- DropTable
DROP TABLE "admin_settings";

-- DropTable
DROP TABLE "admin_transfers";

-- DropTable
DROP TABLE "ai_alerts";

-- DropTable
DROP TABLE "ai_diagrams";

-- DropTable
DROP TABLE "ai_generations";

-- DropTable
DROP TABLE "ai_learning";

-- DropTable
DROP TABLE "ai_models";

-- DropTable
DROP TABLE "ai_monitoring_alerts";

-- DropTable
DROP TABLE "ai_monitoring_rules";

-- DropTable
DROP TABLE "ai_reports";

-- DropTable
DROP TABLE "ai_suggestions";

-- DropTable
DROP TABLE "ai_system_config";

-- DropTable
DROP TABLE "ai_tasks";

-- DropTable
DROP TABLE "ai_training_data";

-- DropTable
DROP TABLE "ai_usage_metrics";

-- DropTable
DROP TABLE "ai_usage_quotas";

-- DropTable
DROP TABLE "ai_workflow_executions";

-- DropTable
DROP TABLE "ai_workflows";

-- DropTable
DROP TABLE "app_roles";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "backup_codes";

-- DropTable
DROP TABLE "blockchain_verifications";

-- DropTable
DROP TABLE "blog_categories";

-- DropTable
DROP TABLE "blog_comments";

-- DropTable
DROP TABLE "blog_media";

-- DropTable
DROP TABLE "blog_posts";

-- DropTable
DROP TABLE "board_members";

-- DropTable
DROP TABLE "bot_detections";

-- DropTable
DROP TABLE "chat_messages";

-- DropTable
DROP TABLE "chat_sessions";

-- DropTable
DROP TABLE "click_events";

-- DropTable
DROP TABLE "codebase_index";

-- DropTable
DROP TABLE "compliance_alerts";

-- DropTable
DROP TABLE "compliance_logs";

-- DropTable
DROP TABLE "consultation_messages";

-- DropTable
DROP TABLE "consultations";

-- DropTable
DROP TABLE "copilot_feedback";

-- DropTable
DROP TABLE "copilot_interactions";

-- DropTable
DROP TABLE "copilot_tasks";

-- DropTable
DROP TABLE "crisis_events";

-- DropTable
DROP TABLE "crypto_deposits";

-- DropTable
DROP TABLE "crypto_ledger";

-- DropTable
DROP TABLE "crypto_orders";

-- DropTable
DROP TABLE "crypto_price_data";

-- DropTable
DROP TABLE "crypto_withdrawals";

-- DropTable
DROP TABLE "debit_cards";

-- DropTable
DROP TABLE "diagram_comments";

-- DropTable
DROP TABLE "diagram_exports";

-- DropTable
DROP TABLE "diagram_members";

-- DropTable
DROP TABLE "doctors";

-- DropTable
DROP TABLE "eth_activity";

-- DropTable
DROP TABLE "financial_ledger";

-- DropTable
DROP TABLE "fraud_scores";

-- DropTable
DROP TABLE "health_readings";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "ip_blocks";

-- DropTable
DROP TABLE "job_logs";

-- DropTable
DROP TABLE "jurisdiction_rules";

-- DropTable
DROP TABLE "kanban_boards";

-- DropTable
DROP TABLE "kanban_columns";

-- DropTable
DROP TABLE "loans";

-- DropTable
DROP TABLE "market_intelligence";

-- DropTable
DROP TABLE "medbeds_bookings";

-- DropTable
DROP TABLE "notification_logs";

-- DropTable
DROP TABLE "notification_preferences";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "oal_audit_log";

-- DropTable
DROP TABLE "payment_methods";

-- DropTable
DROP TABLE "payment_plans";

-- DropTable
DROP TABLE "payment_subscriptions";

-- DropTable
DROP TABLE "payment_transactions";

-- DropTable
DROP TABLE "pricing_plans";

-- DropTable
DROP TABLE "processor_configs";

-- DropTable
DROP TABLE "project_members";

-- DropTable
DROP TABLE "project_tags";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "push_subscriptions";

-- DropTable
DROP TABLE "rewards";

-- DropTable
DROP TABLE "risk_assessments";

-- DropTable
DROP TABLE "scam_addresses";

-- DropTable
DROP TABLE "security_patches";

-- DropTable
DROP TABLE "seo_audits";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "sitemaps";

-- DropTable
DROP TABLE "social_media_accounts";

-- DropTable
DROP TABLE "social_media_posts";

-- DropTable
DROP TABLE "sprints";

-- DropTable
DROP TABLE "sticky_note_boards";

-- DropTable
DROP TABLE "sticky_notes";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "support_tickets";

-- DropTable
DROP TABLE "system_alerts";

-- DropTable
DROP TABLE "system_config";

-- DropTable
DROP TABLE "system_status";

-- DropTable
DROP TABLE "task_attachments";

-- DropTable
DROP TABLE "task_comments";

-- DropTable
DROP TABLE "task_dependencies";

-- DropTable
DROP TABLE "task_tags";

-- DropTable
DROP TABLE "tasks";

-- DropTable
DROP TABLE "time_entries";

-- DropTable
DROP TABLE "token_transactions";

-- DropTable
DROP TABLE "token_wallets";

-- DropTable
DROP TABLE "transactions";

-- DropTable
DROP TABLE "uploaded_files";

-- DropTable
DROP TABLE "usage_records";

-- DropTable
DROP TABLE "user_crypto_balances";

-- DropTable
DROP TABLE "user_preferences";

-- DropTable
DROP TABLE "user_tiers";

-- DropTable
DROP TABLE "user_wallets";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "vault_audit_logs";

-- DropTable
DROP TABLE "vault_secrets";

-- DropTable
DROP TABLE "webhook_events";

-- DropEnum
DROP TYPE "BoardMemberRole";

-- DropEnum
DROP TYPE "DiagramRole";

-- DropEnum
DROP TYPE "DiagramType";

-- DropEnum
DROP TYPE "ExportFormat";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoApproved" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "kycStatus" "KYCStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "kycSubmittedAt" TIMESTAMP(3),
    "kycApprovedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ethereumAddress" TEXT NOT NULL,
    "polygonAddress" TEXT NOT NULL,
    "bscAddress" TEXT NOT NULL,
    "arbitrumAddress" TEXT NOT NULL,
    "optimismAddress" TEXT NOT NULL,
    "stellarAddress" TEXT NOT NULL,
    "ethereumPrivateKey" TEXT NOT NULL,
    "polygonPrivateKey" TEXT NOT NULL,
    "bscPrivateKey" TEXT NOT NULL,
    "arbitrumPrivateKey" TEXT NOT NULL,
    "optimismPrivateKey" TEXT NOT NULL,
    "stellarPrivateKey" TEXT NOT NULL,
    "ethereumBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "polygonBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "bscBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "arbitrumBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "optimismBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "stellarBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "usdValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardholderName" TEXT NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "cvv" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "chain" TEXT,
    "txHash" TEXT,
    "fromAddress" TEXT,
    "toAddress" TEXT,
    "gasUsed" DECIMAL(65,30),
    "gasFee" DECIMAL(65,30),
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalFacility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "generalBeds" INTEGER NOT NULL DEFAULT 0,
    "icuBeds" INTEGER NOT NULL DEFAULT 0,
    "emergencyBeds" INTEGER NOT NULL DEFAULT 0,
    "maternityBeds" INTEGER NOT NULL DEFAULT 0,
    "pediatricBeds" INTEGER NOT NULL DEFAULT 0,
    "surgicalBeds" INTEGER NOT NULL DEFAULT 0,
    "generalAvailable" INTEGER NOT NULL DEFAULT 0,
    "icuAvailable" INTEGER NOT NULL DEFAULT 0,
    "emergencyAvailable" INTEGER NOT NULL DEFAULT 0,
    "maternityAvailable" INTEGER NOT NULL DEFAULT 0,
    "pediatricAvailable" INTEGER NOT NULL DEFAULT 0,
    "surgicalAvailable" INTEGER NOT NULL DEFAULT 0,
    "generalPrice" DECIMAL(65,30) NOT NULL,
    "icuPrice" DECIMAL(65,30) NOT NULL,
    "emergencyPrice" DECIMAL(65,30) NOT NULL,
    "maternityPrice" DECIMAL(65,30) NOT NULL,
    "pediatricPrice" DECIMAL(65,30) NOT NULL,
    "surgicalPrice" DECIMAL(65,30) NOT NULL,
    "acceptsCrypto" BOOLEAN NOT NULL DEFAULT true,
    "acceptsFiat" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "bedType" "BedType" NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientAge" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "pricePerDay" DECIMAL(65,30) NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentCurrency" TEXT,
    "paymentTxHash" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "confirmationNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "doctorName" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentTime" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "cost" DECIMAL(65,30) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentTxHash" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" "AdminActionType" NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "resendId" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_registeredAt_idx" ON "User"("registeredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ethereumAddress_key" ON "Wallet"("ethereumAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_polygonAddress_key" ON "Wallet"("polygonAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_bscAddress_key" ON "Wallet"("bscAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_arbitrumAddress_key" ON "Wallet"("arbitrumAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_optimismAddress_key" ON "Wallet"("optimismAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_stellarAddress_key" ON "Wallet"("stellarAddress");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualCard_cardNumber_key" ON "VirtualCard"("cardNumber");

-- CreateIndex
CREATE INDEX "VirtualCard_userId_idx" ON "VirtualCard"("userId");

-- CreateIndex
CREATE INDEX "VirtualCard_status_idx" ON "VirtualCard"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "MedicalFacility_city_state_idx" ON "MedicalFacility"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalBooking_confirmationNumber_key" ON "MedicalBooking"("confirmationNumber");

-- CreateIndex
CREATE INDEX "MedicalBooking_userId_idx" ON "MedicalBooking"("userId");

-- CreateIndex
CREATE INDEX "MedicalBooking_facilityId_idx" ON "MedicalBooking"("facilityId");

-- CreateIndex
CREATE INDEX "MedicalBooking_status_idx" ON "MedicalBooking"("status");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_facilityId_idx" ON "Appointment"("facilityId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- CreateIndex
CREATE INDEX "AdminAction_adminId_idx" ON "AdminAction"("adminId");

-- CreateIndex
CREATE INDEX "AdminAction_action_idx" ON "AdminAction"("action");

-- CreateIndex
CREATE INDEX "AdminAction_createdAt_idx" ON "AdminAction"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_to_idx" ON "EmailLog"("to");

-- CreateIndex
CREATE INDEX "EmailLog_template_idx" ON "EmailLog"("template");

-- CreateIndex
CREATE INDEX "EmailLog_sentAt_idx" ON "EmailLog"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE INDEX "SystemConfig_key_idx" ON "SystemConfig"("key");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualCard" ADD CONSTRAINT "VirtualCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalBooking" ADD CONSTRAINT "MedicalBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalBooking" ADD CONSTRAINT "MedicalBooking_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "MedicalFacility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "MedicalFacility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
