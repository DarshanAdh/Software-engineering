# Creating a Remote Branch for Local Development

This guide will help you create a remote branch on GitHub for local development without any Netlify or deployment-related files.

## Option 1: Using the GitHub Web Interface

1. **Go to your GitHub repository**:
   - Visit https://github.com/DarshanAdh/Software-engineering

2. **Create a new branch**:
   - Click on the branch dropdown (usually shows "master" or "main")
   - Type "local-development-backup" in the search box
   - Click "Create branch: local-development-backup from 'master'"

3. **Upload the local development files**:
   - Navigate to the newly created branch
   - Click "Add file" > "Upload files"
   - Upload the following files from your local repository:
     - LOCAL_DEVELOPMENT.md
     - cleanup-for-local-dev.sh
     - .env.local.template
     - CREATE_BACKUP_BRANCH.md
   - Add a commit message like "Add local development files"
   - Click "Commit changes"

4. **Clone the branch locally**:
   ```bash
   git clone -b local-development-backup https://github.com/DarshanAdh/Software-engineering.git local-dev
   cd local-dev
   ```

5. **Run the cleanup script**:
   ```bash
   chmod +x cleanup-for-local-dev.sh
   ./cleanup-for-local-dev.sh
   ```

6. **Set up the environment**:
   ```bash
   cp .env.local.template .env
   ```

7. **Install dependencies and start development**:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   npm run dev:concurrent
   ```

## Option 2: Using Git Commands

1. **Open a terminal window** on your computer

2. **Navigate to your repository**:
   ```bash
   cd /Users/darshanadhikari/Desktop/Software-engineering
   ```

3. **Create a new orphan branch** (a branch with no history):
   ```bash
   git checkout --orphan local-development-backup
   ```

4. **Remove all files from the staging area**:
   ```bash
   git rm -rf .
   ```

5. **Copy the local development files** from your backup:
   ```bash
   cp /path/to/backup/LOCAL_DEVELOPMENT.md .
   cp /path/to/backup/cleanup-for-local-dev.sh .
   cp /path/to/backup/.env.local.template .
   cp /path/to/backup/CREATE_BACKUP_BRANCH.md .
   ```

6. **Add the files to the staging area**:
   ```bash
   git add LOCAL_DEVELOPMENT.md
   git add cleanup-for-local-dev.sh
   git add .env.local.template
   git add CREATE_BACKUP_BRANCH.md
   ```

7. **Commit the changes**:
   ```bash
   git commit -m "Create clean local development backup branch"
   ```

8. **Push the branch to GitHub**:
   ```bash
   git push -u origin local-development-backup
   ```

9. **Clone the branch to a new directory** for development:
   ```bash
   cd ..
   git clone -b local-development-backup https://github.com/DarshanAdh/Software-engineering.git local-dev
   cd local-dev
   ```

10. **Set up the environment and install dependencies**:
    ```bash
    cp .env.local.template .env
    npm install
    cd server
    npm install
    cd ..
    npm run dev:concurrent
    ```

## Option 3: Using GitHub Desktop

If you're having issues with Git commands, GitHub Desktop provides a user-friendly interface:

1. **Download and install GitHub Desktop**:
   - Visit https://desktop.github.com/ and download the app

2. **Clone your repository**:
   - In GitHub Desktop, click "File" > "Clone Repository"
   - Select your repository and click "Clone"

3. **Create a new branch**:
   - Click on the current branch dropdown
   - Click "New Branch"
   - Name it "local-development-backup"
   - Click "Create Branch"

4. **Copy the local development files**:
   - Copy the files from your backup to the repository folder

5. **Commit the changes**:
   - In GitHub Desktop, review the changes
   - Add a commit message like "Create clean local development backup branch"
   - Click "Commit to local-development-backup"

6. **Push the branch to GitHub**:
   - Click "Publish branch" or "Push origin"

7. **Set up the environment and install dependencies**:
   - Follow steps 10 from Option 2
