# Deploying to pixenect.com on a Linux VPS

This app is a static Vite build with React Router. Deploy it behind Nginx with an SPA fallback so direct visits to routes like `/about` and `/services/web-development` keep working.

## 1. Point the domain to the VPS

Create or confirm these DNS records:

- `A` record: `pixenect.com` -> `13.140.190.204`
- `A` record: `www` -> `13.140.190.204`

Wait for DNS to propagate before requesting TLS certificates.

## 2. Build the site locally

From the project root:

```powershell
npm install
npm run build
```

This produces the production files in `dist/`.

## 3. Copy the build to the server

Example from PowerShell using OpenSSH:

```powershell
scp -r .\dist\* root@13.140.190.204:/var/www/pixenect/
```

If the server user is not `root`, replace it with your SSH user.

## 4. Install Nginx on the VPS

On the server:

```bash
sudo apt update
sudo apt install -y nginx
sudo mkdir -p /var/www/pixenect
sudo chown -R $USER:$USER /var/www/pixenect
```

## 5. Add the Nginx site config

Copy `deploy/nginx-pixenect.conf` to `/etc/nginx/sites-available/pixenect`.

Then enable it:

```bash
sudo ln -s /etc/nginx/sites-available/pixenect /etc/nginx/sites-enabled/pixenect
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Enable HTTPS

Install Certbot and request a certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pixenect.com -d www.pixenect.com
```

## 7. Updating the site later

For future deploys:

```powershell
npm run build
scp -r .\dist\* root@13.140.190.204:/var/www/pixenect/
```

Then on the server:

```bash
sudo systemctl reload nginx
```

## Notes

- The Nginx config uses `try_files` to serve `index.html` for unknown routes, which is required for React Router.
- If you want zero-downtime or git-based deployments, the next step is adding a small deploy script or CI workflow.