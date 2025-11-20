# Ansible Configuration Management

This directory contains Ansible playbooks and roles for automated server configuration and application deployment.

## Structure

```
ansible/
├── ansible.cfg              # Ansible configuration
├── inventory/
│   ├── azure_rm.yml        # Dynamic Azure inventory
│   └── hosts               # Static inventory (fallback)
├── playbooks/
│   └── setup-server.yml    # Main deployment playbook
├── roles/
│   ├── docker/             # Install and configure Docker
│   ├── security/           # Security hardening
│   └── app-deploy/         # Application deployment
└── templates/              # Global templates (if needed)
```

## Prerequisites

1. **Install Ansible locally:**

   ```bash
   pip install ansible
   ```

2. **Install required Azure collection:**

   ```bash
   ansible-galaxy collection install azure.azcollection community.docker
   pip install -r https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt
   ```

3. **Set Azure credentials:**

   ```bash
   export ARM_CLIENT_ID="your-client-id"
   export ARM_CLIENT_SECRET="your-client-secret"
   export ARM_TENANT_ID="your-tenant-id"
   export ARM_SUBSCRIPTION_ID="your-subscription-id"
   ```

4. **Set application variables:**
   ```bash
   export ACR_LOGIN_SERVER="youracr.azurecr.io"
   export IMAGE_TAG="main"
   export DB_USER="postgres"
   export DB_PASSWORD="your-strong-password"
   export DB_NAME="taskdb"
   export SECRET_KEY="your-secret-key"
   ```

## Usage

### Test connectivity

```bash
cd ansible
ansible all -m ping -i inventory/azure_rm.yml
```

### Dry run (check mode)

```bash
ansible-playbook playbooks/setup-server.yml -i inventory/azure_rm.yml --check
```

### Deploy application

```bash
ansible-playbook playbooks/setup-server.yml -i inventory/azure_rm.yml -vv
```

### Deploy with specific tags

```bash
# Only run security tasks
ansible-playbook playbooks/setup-server.yml -i inventory/azure_rm.yml --tags security

# Only deploy application
ansible-playbook playbooks/setup-server.yml -i inventory/azure_rm.yml --tags app-deploy
```

## Roles

### docker

Installs Docker Engine, Docker Compose, and configures the Docker daemon.

**Tasks:**

- Install Docker CE and dependencies
- Add user to docker group
- Enable Docker service

### security

Hardens server security with firewall rules and automatic updates.

**Tasks:**

- Configure UFW firewall
- Install and enable fail2ban
- Configure automatic security updates
- Set proper file permissions

### app-deploy

Deploys the application using Docker Compose.

**Tasks:**

- Create application directory
- Login to Azure Container Registry
- Deploy docker-compose.yml
- Pull and start containers
- Verify application health

## CI/CD Integration

The Ansible deployment is integrated into the GitHub Actions workflow:

1. Terraform provisions infrastructure
2. Docker images are built and pushed to ACR
3. Ansible configures the VM and deploys the application

See `.github/workflows/ci-cd.yml` for the complete pipeline.

## Troubleshooting

### Dynamic inventory not working

```bash
# Test Azure inventory
ansible-inventory -i inventory/azure_rm.yml --list

# Use verbose mode to see connection issues
ansible all -m ping -i inventory/azure_rm.yml -vvv
```

### Connection issues

```bash
# Check if VM is accessible
ssh azureuser@<vm-ip>

# Verify SSH key is correct
ssh-add -l
```

### Container issues

```bash
# SSH into VM and check containers
ssh azureuser@<vm-ip>
docker compose -f /opt/devops-app/docker-compose.yml ps
docker compose -f /opt/devops-app/docker-compose.yml logs
```

## Variables

All variables can be set via:

1. Environment variables (recommended for CI/CD)
2. Command line: `-e "var_name=value"`
3. Inventory variables
4. Role defaults

### Required Variables

- `db_password`: PostgreSQL password
- `acr_login_server`: Azure Container Registry URL

### Optional Variables (with defaults)

- `db_user`: postgres
- `db_name`: taskdb
- `image_tag`: main
- `secret_key`: auto-generated

## Security Notes

- Never commit passwords or secrets to version control
- Use Azure Key Vault or GitHub Secrets for sensitive data
- The `.env` file contains sensitive information and is not committed
- Firewall rules allow only necessary ports (22, 80, 443, 5000)
