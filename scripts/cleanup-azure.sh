#!/bin/bash
# Cleanup Azure Resources Script
# This script removes all Azure resources created by Terraform

set -e

echo "⚠️  WARNING: This will DELETE all Azure resources for the DevOps Pipeline project"
echo "Resource Group: devopspipeline-dev-rg"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo "🔍 Checking if resource group exists..."
RG_NAME="devopspipeline-dev-rg"

if az group show --name $RG_NAME &> /dev/null; then
    echo "📦 Found resource group: $RG_NAME"
    echo "🗑️  Deleting resource group and all resources..."
    az group delete --name $RG_NAME --yes --no-wait
    echo "✅ Deletion initiated (running in background)"
    echo "   Check status with: az group show --name $RG_NAME"
else
    echo "✅ Resource group does not exist. Nothing to clean up."
fi

echo ""
echo "🧹 Cleaning up local Terraform state..."
cd "$(dirname "$0")/../terraform"
rm -rf .terraform/
rm -f .terraform.lock.hcl
rm -f terraform.tfstate*
rm -f tfplan

echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Wait for Azure resource deletion to complete (5-10 minutes)"
echo "2. Run: terraform init"
echo "3. Run: terraform plan"
echo "4. Run: terraform apply"
