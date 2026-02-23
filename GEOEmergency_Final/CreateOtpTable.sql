-- SQL Script to create OtpVerification table
-- Run this in SQL Server Management Studio or your database tool

USE [projectDB]
GO

-- Create OtpVerifications table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OtpVerifications' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[OtpVerifications](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Email] [nvarchar](450) NOT NULL,
        [Otp] [nvarchar](6) NOT NULL,
        [ExpirationTime] [datetime2](7) NOT NULL,
        [IsVerified] [bit] NOT NULL DEFAULT 0,
        [CreatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_OtpVerifications] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    
    -- Add indexes
    CREATE NONCLUSTERED INDEX [IX_OtpVerifications_Email] ON [dbo].[OtpVerifications]([Email] ASC)
    CREATE NONCLUSTERED INDEX [IX_OtpVerifications_Email_IsVerified] ON [dbo].[OtpVerifications]([Email] ASC, [IsVerified] ASC)
END
GO

-- Add IsEmailVerified column to Users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'IsEmailVerified')
BEGIN
    ALTER TABLE [dbo].[Users]
    ADD [IsEmailVerified] [bit] NOT NULL DEFAULT 0
END
GO