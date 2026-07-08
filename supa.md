# Supabase Environment Variable Examples

Here is what each of these values will look like when you copy them from your Supabase dashboard into Vercel:

### 1. DATABASE_URL
**What it looks like:** 
`postgresql://postgres.yourprojectid:YourStrongPassword123@aws-0-us-west-1.pooler.supabase.com:5432/postgres`

**Where to find it:** 
In Supabase, go to **Project Settings** (the gear icon) > **Database** > Scroll down to **Connection string** > Select **URI**. (Make sure to replace `[YOUR-PASSWORD]` with your actual database password).

*Note: In your project, you actually already have one hardcoded in `backend/app/database.py` that looks like this: `postgresql://postgres.qcxgpylocedhgjbsqlhw:...` You can just use that one!*

---

### 2. SUPABASE_URL
**What it looks like:**
`https://qcxgpylocedhgjbsqlhw.supabase.co`

**Where to find it:**
In Supabase, go to **Project Settings** (the gear icon) > **API** > Look under the **Project URL** section.

---

### 3. SUPABASE_KEY
**What it looks like:**
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGdweWxvY2VkaGdqYnNxbGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjMwMjIzNiwiZXhwIjo...` (It is a very long string).

**Where to find it:**
In Supabase, go to **Project Settings** (the gear icon) > **API** > Look under **Project API keys**. You will see two keys: `anon` and `service_role`. 
You should copy the **`service_role`** key (it might say `secret` next to it and require you to click a button to reveal it). 
*(We use the service_role key here because it bypasses security rules, allowing your backend serverless function to upload images directly into the bucket without needing to configure complex Row-Level Security policies).*

---

### Your Exact DATABASE_URL

**DATABASE_URL:**
``text
postgresql://postgres.qcxgpylocedhgjbsqlhw:BobbyFashion%231234@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
``

---

### Your Exact SUPABASE_URL

**SUPABASE_URL:**
``text
https://qcxgpylocedhgjbsqlhw.supabase.co
``

---

### Your Exact SUPABASE_KEY

**SUPABASE_KEY:**
``text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGdweWxvY2VkaGdqYnNxbGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA4ODgzMiwiZXhwIjoyMDk4NjY0ODMyfQ.K1pDIZ8VW9SXpZjtoB-Q3P6KbRBQwhlSDvjdwAdkHTc
``
