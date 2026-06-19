# How to Upload ROMAVEN LTD Website to GitHub

Follow these steps to upload your website to GitHub:

## Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter a repository name (e.g., "romaven-ltd-website")
4. Add a description (e.g., "Official website for ROMAVEN LTD")
5. Choose "Public" or "Private" (public is free)
6. Initialize the repository with a README file
7. Click "Create repository"

## Step 2: Set Up Git on Your Computer
If you don't have Git installed, download it from [git-scm.com](https://git-scm.com)

Open a command prompt or terminal and run these commands:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Step 3: Upload Your Files
Navigate to your website folder in the terminal/command prompt:

```bash
cd c:\Users\Admin\Desktop\ltd 2
```

Initialize the Git repository:

```bash
git init
```

Add all your files to the repository:

```bash
git add .
```

Commit your changes:

```bash
git commit -m "Initial commit: ROMAVEN LTD website"
```

Add your GitHub repository as a remote:

```bash
git remote add origin https://github.com/zerbankhalid7-prog/ROMAVEN-LTD.git
```

Push your files to GitHub:

```bash
git push -u origin main
```

If you get an authentication error, you may need to set up GitHub authentication (using SSH or personal access token).

## Step 4: Configure GitHub Pages
1. Go to your repository at https://github.com/zerbankhalid7-prog/ROMAVEN-LTD
2. Click on the "Settings" tab
3. In the left sidebar, click on "Pages"
4. Under "Source", select "Deploy from a branch"
5. Select "main" as the branch and "/ (root)" as the folder
6. Click "Save"
7. Your website will be live at: https://zerbankhalid7-prog.github.io/ROMAVEN-LTD/

## Additional Notes
- The PHP file (contact-form-handler.php) will not work on GitHub Pages because it doesn't support PHP. For the contact form to work, you'll need to host the site on a server that supports PHP.
- All images are using external URLs from Unsplash, so they will work fine.
- The website is responsive and should work well on all devices.

## For Future Updates
To update your website in the future:
1. Make your changes to the files
2. Run `git add .`
3. Run `git commit -m "Your commit message"`
4. Run `git push` to push the changes to GitHub
