# 🛠️ Easy Change Guide (GitHub & Vercel)

This guide provides simple, one-click commands to sync your local changes to the cloud and manage your production environment.

## 📡 Syncing Changes to GitHub

Whenever you make a change and want to see it live on Vercel:

1. **Commit & Push** (Run this in your terminal):
   ```powershell
   git add .
   git commit -m "Update: Participant Portal Overhaul"
   git push origin main
   ```
   *Vercel will automatically detect this and start a new build.*

2. **Force Update** (If GitHub and Local are out of sync):
   ```powershell
   git add .
   git commit -m "Emergency Fix"
   git push origin main --force
   ```

## 🚀 Managing Vercel Deployment

### 1. New Features Verification
After pushing to GitHub, visit your [Vercel Dashboard](https://vercel.com/dashboard).
- Click on your project (**VibeBuild**).
- Look for the "Building" status under the main branch.
- Once finished, click the **Visit** button to see the new **Nexus Grid** and **Submission Page**.

### 2. Updating Environment Variables
If you need to change your database or OpenAI key:
1. Go to **Settings** > **Environment Variables** in Vercel.
2. Update the `MONGODB_URI` or `JWT_SECRET`.
3. Go to the **Deployments** tab and click the three dots (`...`) on the top deployment > **Redeploy**.

## 🛡️ Admin & Database Tips

### Resetting Participant Data
If you want to clear the grid and start fresh:
1. Contact your MongoDB Atlas dashboard.
2. Clear the `projects` collection.
3. The platform will automatically show "Neural Void Detected" in the showcase.

### Accessing the Grid Audit
1. Log in with an **Admin ID** (e.g., `DMP001`).
2. Go to the **Admin Panel** (`/admin`).
3. Switch to the **Projects Review** tab to rate student submissions.

## 🆘 Troubleshooting Build Errors
- **Error: "Module not found"**: Ensure you haven't deleted folder files like `UIComponents.js`.
- **Conflicting Changes**: If `git push` fails, run `git pull origin main --rebase` first, then push again.
