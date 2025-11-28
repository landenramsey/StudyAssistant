# 🔑 How to Get an Azure OpenAI API Key

## Step-by-Step Guide

### Step 1: Sign Up for Azure
1. Go to [https://azure.microsoft.com/free/](https://azure.microsoft.com/free/)
2. Click "Start free" or "Create Azure free account"
3. Sign in with your Microsoft account (or create one)
4. Complete the sign-up process (requires credit card, but free tier won't charge you)

### Step 2: Request Access to Azure OpenAI
1. Go to [https://aka.ms/oai/access](https://aka.ms/oai/access)
2. Fill out the access request form
3. Wait for approval (can take a few days)

### Step 3: Create an Azure OpenAI Resource
1. Go to [Azure Portal](https://portal.azure.com/)
2. Click "Create a resource" (top left)
3. Search for "Azure OpenAI"
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or use existing
   - **Region**: Choose a region (e.g., East US, West Europe)
   - **Name**: Give it a name (e.g., "study-assistant-openai")
   - **Pricing Tier**: Choose "Standard S0" (pay-as-you-go)
6. Click "Review + create", then "Create"

### Step 4: Deploy a Model
1. Once the resource is created, go to it in Azure Portal
2. Click "Go to Azure OpenAI Studio"
3. Click "Deployments" in the left sidebar
4. Click "Create" or "Manage deployments"
5. Deploy a model (e.g., "gpt-4o" or "gpt-4o-mini")
6. Give it a deployment name (e.g., "gpt-4o-mini")
7. Click "Create"

### Step 5: Get Your API Keys
1. In Azure Portal, go to your Azure OpenAI resource
2. Click "Keys and Endpoint" in the left sidebar
3. You'll see:
   - **KEY 1** or **KEY 2** (either works)
   - **Endpoint** (e.g., `https://your-resource.openai.azure.com/`)
   - **API Version** (usually `2024-02-15-preview` or similar)

### Step 6: Update Your .env File

Add these to your `backend/.env` file:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini

# Or use regular OpenAI (if you prefer)
OPENAI_API_KEY=your_openai_key_here
```

## Alternative: Use Regular OpenAI (Easier)

If you don't want to wait for Azure approval, you can use regular OpenAI:

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

## Updating the Code to Use Azure OpenAI

If you want to use Azure OpenAI instead of regular OpenAI, you'll need to update the RAG service. The current code uses regular OpenAI, but it can be modified to support Azure OpenAI.

### Cost Comparison

- **Regular OpenAI**: Pay per token, simple pricing
- **Azure OpenAI**: Similar pricing, but requires Azure subscription and approval

## Troubleshooting

### "Access Denied" Error
- Make sure you've been approved for Azure OpenAI access
- Check that your Azure subscription is active

### "Model Not Found" Error
- Make sure you've deployed a model in Azure OpenAI Studio
- Check that the deployment name matches what's in your .env file

### "Invalid API Key" Error
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Try using KEY 2 if KEY 1 doesn't work

## Need Help?

- Azure OpenAI Documentation: [https://learn.microsoft.com/azure/ai-services/openai/](https://learn.microsoft.com/azure/ai-services/openai/)
- OpenAI Documentation: [https://platform.openai.com/docs](https://platform.openai.com/docs)

