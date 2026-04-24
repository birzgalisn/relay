# Production deploy

GitHub: _Settings → Secrets and variables → Actions_. Use the `Variable` and `Secret` names from the tables exactly.

Order: VPS steps → set vars/secrets → DNS `api.` and `app.` to the server → run workflow `provision` → deploy `api` / `web` (e.g. push `main`).

Registry: CI is logged in to GHCR; Swarm uses `docker stack deploy --with-registry-auth`. For a local `DEPLOY_PHASE=app` run, `docker login ghcr.io` on the host that runs `deploy-swarm.sh`.

## VPS (Ubuntu 22.04+)

Use a recent LTS (22.04 or 24.04 is fine). Stay in a single SSH session. Run steps as `root` or a user with `sudo`. Commands that need to act as the deploy user use `sudo -u deploy` so you never have to log in interactively as `deploy`.

1. **Docker Engine** — Install Docker and the `docker` CLI. The [official Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/) are the reference; the convenience script is usually enough for a new box:

   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   ```

2. **Deploy user** — GitHub Actions will SSH in as a non-root user that can run Docker. Create a dedicated user (here `deploy`), add them to the `docker` group, and set the same name in the `SSH_USER` secret. Do not use `root` for `SSH_USER`.

   ```bash
   sudo adduser deploy
   sudo usermod -aG docker deploy
   ```

3. **SSH key for Actions** — Generate a key pair owned by `deploy` and allow that key to log in as `deploy` on this host. Copy the **private** key from the `cat` at the end (full PEM, including the `BEGIN` / `END` lines) into the `SSH_KEY` secret. GitHub accepts a multiline secret; paste the whole file.

   ```bash
   sudo -u deploy bash -lc '
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys ~/.ssh/id_ed25519
   cat ~/.ssh/id_ed25519
   '
   ```

4. **Docker as `deploy`** — Confirm the daemon and socket work for the user the workflows will use:

   ```bash
   sudo -u deploy docker ps
   ```

5. **Docker Swarm** — Initialize a single-manager Swarm. The address you pass to `--advertise-addr` must be the same IPv4 you will store in the `SWARM_ADVERTISE_ADDR` variable (often the server’s private IP on a VPC, or the public IP if the machine is directly on the internet). This is how the node advertises itself to the overlay network and other services.

   ```bash
   sudo -u deploy docker swarm init --advertise-addr <IPV4>
   ```

6. **SSH hardening (optional but recommended)** — When you are sure you can open a second SSH session and log in with a key, lock out password and keyboard-interactive login. Keep one spare session while you test. If you still need `root` over SSH, install an authorized key under `/root/.ssh/authorized_keys` **before** you disable password authentication.

   ```bash
   printf '%s\n' 'PubkeyAuthentication yes' 'PasswordAuthentication no' 'KbdInteractiveAuthentication no' | sudo tee /etc/ssh/sshd_config.d/99-publickey-only.conf >/dev/null
   sudo sshd -t && sudo systemctl reload ssh
   ```

## Variables

| Name                   | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `PROJECT`              | Traefik label prefix, e.g. `relay`                  |
| `CNAME`                | Apex host, e.g. `relay.example.com` (no `https://`) |
| `SWARM_ADVERTISE_ADDR` | Same IP as `docker swarm init --advertise-addr`     |
| `VITE_API_BASE_URL`    | `https://api.<CNAME>` (must use same `CNAME`)       |

## Secrets

| Name                | Purpose                                                                                                                                                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SSH_USER`          | Linux user for deploy (e.g. `deploy` in `docker` group)                                                                                                                                                                                                                                 |
| `SSH_HOST`          | Server hostname or IP                                                                                                                                                                                                                                                                   |
| `SSH_KEY`           | Private key from VPS step 3; GHA uses it to SSH into the host                                                                                                                                                                                                                           |
| `CF_DNS_API_TOKEN`  | Cloudflare: DNS edit on the zone (Traefik ACME)                                                                                                                                                                                                                                         |
| `ACME_EMAIL`        | Let’s Encrypt contact                                                                                                                                                                                                                                                                   |
| `POSTGRES_USER`     | DB user                                                                                                                                                                                                                                                                                 |
| `POSTGRES_PASSWORD` | DB password                                                                                                                                                                                                                                                                             |
| `POSTGRES_DB`       | DB name                                                                                                                                                                                                                                                                                 |
| `POSTGRES_HOST`     | DB host reachable from GHA for schema migrate (IP or DNS)                                                                                                                                                                                                                               |
| `REDIS_PASSWORD`    | Redis `requirepass`                                                                                                                                                                                                                                                                     |
| `REDIS_ARGS`        | e.g. `--save 60 1 --loglevel warning --requirepass <REDIS_PASSWORD> --protected-mode yes`                                                                                                                                                                                               |
| `DATABASE_URL`      | The API service reaches Postgres on the internal Swarm network (DNS name `postgres`). It is not the same as `POSTGRES_HOST`, which is the address GHA uses to run `migrate` from the internet. Example: `postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>`. |
| `REDIS_URL`         | The API uses the Swarm service `redis` on the same network. Example: `redis://:<REDIS_PASSWORD>@redis:6379/0` (use the `REDIS_PASSWORD` above).                                                                                                                                         |
| `HETZNER_TOKEN`     | Optional. With `HETZNER_FW_ID` and `HETZNER_HOST_ID`, the migrate workflow applies a Hetzner Cloud firewall to this server for the job (opens access to `POSTGRES_HOST:5432`). If any of the three `HETZNER_*` values is empty, the firewall step is skipped.                           |
| `HETZNER_FW_ID`     | Optional. Hetzner firewall ID.                                                                                                                                                                                                                                                          |
| `HETZNER_HOST_ID`   | Optional. Hetzner server ID.                                                                                                                                                                                                                                                            |
