# Email-Based OTP Verification System Implementation

## Overview
This implementation provides a secure email-based OTP verification flow for user registration in the GEO-Based Emergency System.

## Features Implemented

### Backend (.NET Core Web API)
1. **Email Validation**: Server-side regex validation for email format
2. **OTP Generation**: 6-digit numeric OTP with 5-minute expiration
3. **Email Service**: SMTP integration using MailKit
4. **Rate Limiting**: 1 OTP per minute per email address
5. **Security**: OTP invalidation on new requests and after verification

### Frontend (ReactJS)
1. **Email Validation**: Client-side regex validation with real-time feedback
2. **OTP Verification Screen**: Dedicated UI for OTP entry
3. **Resend Functionality**: 60-second cooldown with countdown timer
4. **User Experience**: Visual feedback for verification status

## Database Schema

### OtpVerification Table
```sql
CREATE TABLE [dbo].[OtpVerifications](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Email] [nvarchar](450) NOT NULL,
    [Otp] [nvarchar](6) NOT NULL,
    [ExpirationTime] [datetime2](7) NOT NULL,
    [IsVerified] [bit] NOT NULL DEFAULT 0,
    [CreatedAt] [datetime2](7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_OtpVerifications] PRIMARY KEY CLUSTERED ([Id] ASC)
)
```

### User Table Update
```sql
ALTER TABLE [dbo].[Users]
ADD [IsEmailVerified] [bit] NOT NULL DEFAULT 0
```

## API Endpoints

### 1. Send OTP
- **Endpoint**: `POST /api/auth/send-otp`
- **Request Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "message": "OTP sent successfully" }`
- **Features**: Email validation, rate limiting, OTP generation

### 2. Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Request Body**: `{ "email": "user@example.com", "otp": "123456" }`
- **Response**: `{ "message": "OTP verified successfully" }`
- **Features**: OTP validation, expiration check

### 3. Register (Updated)
- **Endpoint**: `POST /api/auth/register`
- **Requirement**: Email must be verified before registration
- **Features**: Email verification check, user creation

## Configuration Required

### 1. Email Settings (appsettings.json)
```json
{
  "Email": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "From": "your-email@gmail.com",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}
```

### 2. NuGet Package
Add MailKit package to your project:
```xml
<PackageReference Include="MailKit" Version="4.3.0" />
```

## Security Features

1. **Email Format Validation**: Both client and server-side validation
2. **OTP Expiration**: 5-minute expiration time
3. **Rate Limiting**: 1 OTP per minute per email
4. **OTP Invalidation**: Old OTPs are invalidated when new ones are generated
5. **Single Use**: OTPs can only be used once

## User Flow

1. **Registration Start**: User enters details and clicks "Send OTP"
2. **Email Validation**: System validates email format
3. **OTP Generation**: 6-digit OTP generated and sent via email
4. **OTP Entry**: User enters OTP in verification screen
5. **Verification**: System validates OTP and marks email as verified
6. **Registration**: User can complete registration after email verification

## Error Handling

### Backend Errors
- Invalid email format
- Rate limiting exceeded
- Invalid or expired OTP
- Email sending failures

### Frontend Errors
- Email format validation
- OTP length validation
- Network error handling
- User feedback messages

## Installation Steps

### 1. Database Setup
Run the SQL script `CreateOtpTable.sql` to create the required tables.

### 2. Email Configuration
Update `appsettings.json` with your SMTP settings:
- For Gmail: Use App Password instead of regular password
- Enable 2-factor authentication and generate App Password

### 3. Package Installation
The MailKit package is already added to the project file.

### 4. Service Registration
Services are already registered in `Program.cs`:
- `IEmailService` and `EmailService`
- `IOtpService` and `OtpService`

## Testing the Implementation

### 1. Frontend Testing
1. Navigate to registration page
2. Enter email and click "Send OTP"
3. Check email for OTP
4. Enter OTP in verification screen
5. Complete registration

### 2. API Testing
Use tools like Postman to test the API endpoints:

**Send OTP:**
```
POST https://localhost:7075/api/auth/send-otp
Content-Type: application/json

{
  "email": "test@example.com"
}
```

**Verify OTP:**
```
POST https://localhost:7075/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

## Best Practices Implemented

1. **Clean Architecture**: Separation of concerns with services and DTOs
2. **Dependency Injection**: Proper service registration and injection
3. **Error Handling**: Comprehensive error handling and user feedback
4. **Security**: Rate limiting, OTP expiration, and validation
5. **User Experience**: Intuitive UI with visual feedback
6. **Code Quality**: Minimal, focused implementation

## Customization Options

### OTP Settings
- Change OTP length in `OtpService.cs`
- Modify expiration time (currently 5 minutes)
- Adjust rate limiting interval (currently 1 minute)

### Email Template
- Customize email content in `EmailService.cs`
- Add HTML styling or company branding
- Include additional security information

### UI Customization
- Modify styling in `Register.jsx`
- Add animations or transitions
- Customize error messages and feedback

## Troubleshooting

### Common Issues
1. **Email not sending**: Check SMTP settings and credentials
2. **Build errors**: Ensure all packages are installed
3. **Database errors**: Run the SQL script to create tables
4. **Rate limiting**: Wait 1 minute between OTP requests

### Debug Tips
1. Check browser console for frontend errors
2. Review server logs for backend issues
3. Verify database table creation
4. Test SMTP connection separately

This implementation provides a complete, secure, and user-friendly OTP verification system for your GEO-Based Emergency System.