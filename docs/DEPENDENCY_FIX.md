# Fixing Dependency Issues

If you're encountering issues with missing dependencies when running the application, follow these steps to fix them.

## Issues You Might Be Seeing

1. **Vite command not found**:
   ```
   sh: vite: command not found
   npm run client exited with code 127
   ```

2. **Nodemon package.json not found**:
   ```
   Error: ENOENT: no such file or directory, open '/Users/darshanadhikari/Desktop/Software-engineering/server/node_modules/nodemon/bin/../package.json'
   ```

3. **date-fns module error**:
   ```
   Error: Cannot find module './_lib/formatDistance/index.js'
   Require stack:
   - /Users/darshanadhikari/Desktop/Software-engineering/node_modules/date-fns/locale/en-US/index.js
   - /Users/darshanadhikari/Desktop/Software-engineering/node_modules/date-fns/_lib/defaultLocale/index.js
   - /Users/darshanadhikari/Desktop/Software-engineering/node_modules/date-fns/format/index.js
   - /Users/darshanadhikari/Desktop/Software-engineering/node_modules/concurrently/dist/src/flow-control/log-timings.js
   ```

## Solution 1: Using the Fix Script

1. Run the fix-dependencies.sh script:
   ```bash
   ./fix-dependencies.sh
   ```

2. Wait for the script to complete (this may take a few minutes)

3. Start the application:
   ```bash
   npm start
   ```

## Solution 2: Manual Steps

If the script doesn't work, follow these manual steps:

1. **Clean npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Remove node_modules directories**:
   ```bash
   rm -rf node_modules
   rm -rf server/node_modules
   ```

3. **Install client-side dependencies**:
   ```bash
   npm install
   ```

4. **Install server-side dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Start the application**:
   ```bash
   npm start
   ```

## Solution 3: Install Specific Dependencies

If you're still having issues, try installing the specific dependencies that are missing:

1. **Install Vite globally**:
   ```bash
   npm install -g vite
   ```

2. **Install Nodemon globally**:
   ```bash
   npm install -g nodemon
   ```

3. **Install them locally as well**:
   ```bash
   npm install vite --save-dev
   cd server
   npm install nodemon --save-dev
   cd ..
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

## Solution 4: Use npx

If the global installations don't work, you can modify the package.json scripts to use npx:

1. **Edit the client script in package.json**:
   ```json
   "client": "rm -rf node_modules/.vite && npx vite"
   ```

2. **Edit the dev script in server/package.json**:
   ```json
   "dev": "npx nodemon server.js"
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

## Troubleshooting

If you're still having issues:

1. **Check Node.js version**:
   ```bash
   node -v
   ```
   Make sure you're using Node.js v18.17.1 or later.

2. **Check npm version**:
   ```bash
   npm -v
   ```
   Make sure you're using npm v9.0.0 or later.

3. **Try using a different package manager**:
   ```bash
   # Using yarn
   yarn install
   cd server
   yarn install
   cd ..
   yarn start

   # Using pnpm
   pnpm install
   cd server
   pnpm install
   cd ..
   pnpm start
   ```
