# MCP Configuration Guide for Windows

Simple guide to configure MCP servers for Azure DevOps and SQL Server integration with Claude Code.

---

## What You Need

- Node.js installed (check with: `node --version`)
- SQL Server running
- Azure DevOps account with Personal Access Token (PAT)

---

## Authentication Methods Comparison

| Feature | Windows Auth (Recommended) | SQL Server Auth |
|---------|---------------------------|-----------------|
| **Security** | ✅ No passwords in files | ❌ Password in config |
| **Permissions** | ✅ Per-user (Windows account) | ❌ Same for everyone |
| **Read-only users** | ✅ Automatically blocked from UPDATE/INSERT | ❌ Can do anything |
| **Setup** | ✅ Simpler (no credentials) | ❌ Need username/password |
| **Use when** | Multiple users with different permissions | Single user or testing |

---

## Step 1: Create Configuration Files

Navigate to your project folder:

```bash
cd C:\Dev\Web\SourceCode
```

---

## Step 2: Create `.claude\settings.local.json`

Create this file in `.claude` folder:

### ✅ Option A: Windows Authentication (Recommended)

Uses your Windows account permissions. If you only have read access in SQL Server, you won't be able to UPDATE/INSERT/DELETE.

```json
{
  "env": {
    "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/BrandMuscle",
    "AZURE_DEVOPS_PAT": "your-pat-token-here",
    "MSSQL_SERVER": "codb01U.Brandmuscle.local",
    "MSSQL_DATABASE": "CentivPOS"
  },
  "permissions": {
    "allow": [
      "mcp__azuredevops__*",
      "mcp__mssql__*",
      "Bash(sqlcmd:*)"
    ]
  },
  "enableAllProjectMcpServers": true
}
```

**Replace:**
- `your-pat-token-here` with your Azure DevOps PAT

### Option B: SQL Server Authentication (Old Method)

Uses hardcoded username/password. Everyone using this config has the same permissions.

```json
{
  "env": {
    "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/BrandMuscle",
    "AZURE_DEVOPS_PAT": "your-pat-token-here",
    "MSSQL_SERVER": "codb01U.Brandmuscle.local",
    "MSSQL_USER": "WebAPI",
    "MSSQL_PASSWORD": "your-password-here",
    "MSSQL_DATABASE": "CentivPOS"
  },
  "permissions": {
    "allow": [
      "mcp__azuredevops__*",
      "mcp__mssql__*",
      "Bash(sqlcmd:*)"
    ]
  },
  "enableAllProjectMcpServers": true
}
```

**Replace:**
- `your-pat-token-here` with your Azure DevOps PAT
- `your-password-here` with your SQL Server password

---

## Step 3: Create `.claude\.mcp.json`

Create this file in `.claude` folder:

### ✅ Option A: Windows Authentication (Recommended)

```json
{
  "mcpServers": {
    "azure-devops": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@azure-devops/mcp"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "${AZURE_DEVOPS_ORG_URL}",
        "AZURE_DEVOPS_PAT": "${AZURE_DEVOPS_PAT}"
      }
    },
    "mssql": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mssql-mcp"],
      "env": {
        "MSSQL_SERVER": "${MSSQL_SERVER}",
        "MSSQL_DATABASE": "${MSSQL_DATABASE}",
        "MSSQL_TRUSTED_CONNECTION": "true",
        "MSSQL_ENCRYPT": "false",
        "MSSQL_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

**Note:** No username/password needed. Uses your Windows account.

### Option B: SQL Server Authentication (Old Method)

```json
{
  "mcpServers": {
    "azure-devops": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@azure-devops/mcp"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "${AZURE_DEVOPS_ORG_URL}",
        "AZURE_DEVOPS_PAT": "${AZURE_DEVOPS_PAT}"
      }
    },
    "mssql": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mssql-mcp"],
      "env": {
        "MSSQL_SERVER": "${MSSQL_SERVER}",
        "MSSQL_USER": "${MSSQL_USER}",
        "MSSQL_PASSWORD": "${MSSQL_PASSWORD}",
        "MSSQL_DATABASE": "${MSSQL_DATABASE}",
        "MSSQL_ENCRYPT": "false",
        "MSSQL_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

---

## Step 4: Alternative - Root Level `.mcp.json`

OR create this simpler file in project root:

### ✅ Option A: Windows Authentication (Recommended)

```json
{
  "mcpServers": {
    "azuredevops": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "BrandMuscle", "--authentication", "env"]
    },
    "mssql": {
      "command": "npx",
      "args": ["-y", "mssql-mcp"],
      "env": {
        "DB_SERVER": "codb01U.Brandmuscle.local",
        "DB_DATABASE": "CentivPOS",
        "DB_PORT": "1433",
        "DB_TRUSTED_CONNECTION": "true",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

### Option B: SQL Server Authentication (Old Method)

```json
{
  "mcpServers": {
    "azuredevops": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "BrandMuscle", "--authentication", "env"]
    },
    "mssql": {
      "command": "npx",
      "args": ["-y", "mssql-mcp"],
      "env": {
        "DB_SERVER": "codb01U.Brandmuscle.local",
        "DB_DATABASE": "CentivPOS",
        "DB_USER": "WebAPI",
        "DB_PASSWORD": "your-password-here",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

---

## Step 5: Test Configuration

Open Claude Code and test:

```bash
# List databases
List all databases on the server

# Query data
Show me tables in CentivPOS database

# Check Azure DevOps
List all projects in Azure DevOps
```

---

## Folder Structure

Your project should look like this:

```
C:\Dev\Web\SourceCode\
├── .claude\
│   ├── settings.local.json
│   └── .mcp.json
└── .mcp.json (optional)
```

---

## NPM Packages Used

These packages are automatically downloaded by `npx`:

- `@azure-devops/mcp` - Azure DevOps integration
- `mssql-mcp` - SQL Server integration

No manual installation needed!

---

## Important Notes

1. **Windows Authentication Benefits**:
   - No hardcoded passwords
   - Uses your Windows account permissions
   - If you have only READ access, you cannot UPDATE/INSERT/DELETE
   - More secure and follows Windows security policies

2. **Never commit credentials** - Add to `.gitignore`:
   ```
   .claude/settings.local.json
   .mcp.json
   ```

3. **Environment variables** are loaded from `settings.local.json` using `${VARIABLE_NAME}` syntax

4. **First run is slow** - NPX downloads packages on first use

---

## Rollback to Old Configuration

If you want to go back to SQL Server Authentication (with username/password):

### Step 1: Update `.claude\settings.local.json`

Add back the user and password:

```json
{
  "env": {
    "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/BrandMuscle",
    "AZURE_DEVOPS_PAT": "your-pat-token-here",
    "MSSQL_SERVER": "codb01U.Brandmuscle.local",
    "MSSQL_USER": "WebAPI",
    "MSSQL_PASSWORD": "WwltlNyy@5G6!Vf",
    "MSSQL_DATABASE": "CentivPOS"
  },
  "permissions": {
    "allow": [
      "mcp__azuredevops__*",
      "mcp__mssql__*",
      "Bash(sqlcmd:*)"
    ]
  },
  "enableAllProjectMcpServers": true
}
```

### Step 2: Update `.claude\.mcp.json`

Replace the mssql section:

```json
{
  "mcpServers": {
    "azure-devops": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@azure-devops/mcp"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "${AZURE_DEVOPS_ORG_URL}",
        "AZURE_DEVOPS_PAT": "${AZURE_DEVOPS_PAT}"
      }
    },
    "mssql": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mssql-mcp"],
      "env": {
        "MSSQL_SERVER": "${MSSQL_SERVER}",
        "MSSQL_USER": "${MSSQL_USER}",
        "MSSQL_PASSWORD": "${MSSQL_PASSWORD}",
        "MSSQL_DATABASE": "${MSSQL_DATABASE}",
        "MSSQL_ENCRYPT": "false",
        "MSSQL_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

**Key Change:** Remove `MSSQL_TRUSTED_CONNECTION` and add back `MSSQL_USER` and `MSSQL_PASSWORD`

### Step 3: Restart Claude Code

Close and reopen Claude Code for changes to take effect.

---

## Troubleshooting

**MCP tools not showing?**

```bash
# Test if npx works
npx -y @azure-devops/mcp --version
npx -y mssql-mcp --version
```

**Connection failed?**

- Check SQL Server is running
- Verify credentials in `settings.local.json`
- Check Azure DevOps PAT hasn't expired

---

**That's it! You're done.**
