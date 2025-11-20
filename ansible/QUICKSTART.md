# Ansible Deployment Instructions

## Quick Start

1. **Set required environment variables:**

   ```bash
   export ARM_CLIENT_ID="<your-azure-client-id>"
   export ARM_CLIENT_SECRET="<your-azure-client-secret>"
   export ARM_TENANT_ID="<your-azure-tenant-id>"
   export ARM_SUBSCRIPTION_ID="<your-azure-subscription-id>"
   export ACR_LOGIN_SERVER="<your-acr>.azurecr.io"
   export IMAGE_TAG="main"
   export DB_PASSWORD="<strong-password>"
   ```

2. **Install Ansible and dependencies:**

   ```bash
   pip install -r ansible/requirements.txt
   ansible-galaxy collection install azure.azcollection community.docker
   pip install azure-cli-core azure-mgmt-compute azure-mgmt-network azure-mgmt-resource
   ```

3. **Test connectivity:**

   ```bash
   cd ansible
   ansible all -m ping -i inventory/azure_rm.yml
   ```

4. **Deploy:**
   ```bash
   ansible-playbook playbooks/setup-server.yml -i inventory/azure_rm.yml -vv
   ```

## GitHub Secrets Required

Add these secrets to your GitHub repository:

- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_CREDENTIALS` (JSON format)
- `TF_API_TOKEN`
- `TF_CLOUD_ORGANIZATION`
- `DB_PASSWORD`
- `APP_SECRET_KEY`

## What Gets Deployed

1. **Docker** - Container runtime and Docker Compose
2. **Security** - UFW firewall, fail2ban, automatic updates
3. **Application** - PostgreSQL, Flask backend, React frontend

## Accessing the Application

After deployment:

- Frontend: `http://<VM_PUBLIC_IP>`
- Backend API: `http://<VM_PUBLIC_IP>:5000`
- Health check: `http://<VM_PUBLIC_IP>:5000/health`
