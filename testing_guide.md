# Contact Messages Module - Testing Guide

This guide will walk you through verifying the new Contact Messages module.

## Prerequisites
1. **Database Setup**: Execute the `Backend/setup_messages_table.sql` script against your PostgreSQL database to create the `contact_messages` table.
   ```sql
   psql -U your_user -d elpida_db -f Backend/setup_messages_table.sql
   ```
2. Restart your backend server (`npm run dev` or `node src/server.js`) so it picks up the new routes.
3. Ensure your frontend is running.

## 1. Test Form Submission (Frontend)
1. Navigate to the main website homepage.
2. Scroll down to the **Wholesale Partnerships** contact form (`#contact`).
3. Fill out the form with test data:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `1234567890`
   - Category: `Wholesale & Retail`
   - Inquiry: `This is a test message.`
4. Click **Submit Wholesale Inquiry**.
5. **Expected Result**: 
   - You should see the success UI ("Inquiry Transmitted").
   - A success toast notification should appear.
   - The data should be saved in the `contact_messages` PostgreSQL table.

## 2. Test Admin Dashboard Access
1. Navigate to `/admin` and log in with your admin credentials.
2. In the sidebar, look for the new **Messages** tab (with the Mail icon).
3. Click on **Messages**.
4. **Expected Result**: The Admin Messages Page should load, and you should see the test message you just submitted.

## 3. Test View Modal & Auto-Read
1. In the Messages table, click the **Eye icon (View)** on the right side of the test message.
2. **Expected Result**: 
   - A modal opens displaying the full details (Name, Email, Phone, Date, Subject, Content).
   - The message status should automatically change from **Unread** to **Read** in the background and the UI.
3. Close the modal. The status pill in the table should now say "Read".

## 4. Test Status Changing & Archiving
1. In the Messages table, locate the select dropdown in the "Actions" column.
2. Change the status from "Read" to "Archive".
3. **Expected Result**: 
   - The status pill updates to "Archived".
   - The database record is updated to `archived`. (No record is deleted).

## 5. Test Filters and Search
1. **Search**: Type "Test User" or "test@example.com" in the search bar.
   - **Expected Result**: The table should filter and show the matching message. Type something random like "xyz", and it should show "No messages found matching your criteria."
2. **Filter Tabs**: Change the dropdown filter from "All Messages" to "Unread".
   - **Expected Result**: The archived test message should disappear.
3. Change the filter to "Archived".
   - **Expected Result**: The test message should reappear.

If all the above steps pass, the module is fully functional!
