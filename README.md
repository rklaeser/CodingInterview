# SvelteKit + Firebase + Vercel Template

A production-ready full-stack template featuring:

- **SvelteKit 2** - Modern, fast, and type-safe web framework with Svelte 5 runes
- **Firestore** - NoSQL database with server-side operations via Firebase Admin SDK
- **TailwindCSS** - Utility-first CSS framework with forms and typography plugins
- **Vercel** - Zero-config deployment
- **MCP Server** - Model Context Protocol server for Firestore operations (optional)
- **TypeScript** - Full type safety across the stack
- **Collapsible Sidebar** - Modern navigation with hamburger menu

## Features

### Database
- Firebase Admin SDK integration (server-side only)
- Generic CRUD utilities
- Type-safe Firestore operations
- No client-side Firebase SDK needed

### MCP Server (Optional)
- Generic Firestore operations via MCP
- List, get, create, update, delete documents
- Configurable for Claude Code integration

### UI/UX
- Collapsible sidebar navigation with local storage persistence
- Responsive design with TailwindCSS
- Forms plugin for better form styling
- Typography plugin for content
- Theme preferences (light/dark/system)
- Clean, modern interface

## Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Firebase project ([Create one](https://console.firebase.google.com/))
- Vercel account (for deployment)

### 2. Setup

```bash
# Clone the template
git clone <your-repo-url>
cd sveltekit-firebase-template

# Install dependencies
cd app && npm install
cd ../mcp-server && npm install  # Optional: only if using MCP
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Firestore:
   - Go to Firestore Database
   - Click "Create Database"
   - Choose production mode or test mode
4. Generate service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

### 4. Environment Variables

Create `app/.env`:

```bash
cp app/.env.example app/.env
```

Fill in your Firebase credentials in `app/.env`:

```env
# Server-side (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### 5. Run Locally

```bash
cd app
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
sveltekit-firebase-template/
├── app/                          # SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── server/
│   │   │   │   ├── firebase.ts   # Firebase Admin SDK
│   │   │   │   └── db.ts         # Database utilities
│   │   │   ├── components/
│   │   │   │   └── Sidebar.svelte # Navigation sidebar
│   │   │   ├── stores/
│   │   │   │   └── ui.svelte.ts  # UI state store
│   │   │   └── utils.ts          # Utility functions
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   │   └── example/      # Example API route
│   │   │   ├── example/          # Example page
│   │   │   ├── settings/         # Settings page
│   │   │   ├── +layout.svelte    # Root layout with sidebar
│   │   │   └── +page.svelte      # Home page
│   │   ├── app.css               # Tailwind imports
│   │   └── app.d.ts              # Type definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── mcp-server/                   # Optional MCP server
│   ├── src/
│   │   └── index.ts              # Generic CRUD operations
│   ├── package.json
│   └── .env.example
│
├── firebase.json                 # Firebase config
├── firestore.rules               # Security rules
├── firestore.indexes.json        # Database indexes
├── vercel.json                   # Vercel deployment
└── README.md
```

## Development

### Adding a New Collection

1. Define your type in `app/src/lib/types/index.ts`:

```typescript
export interface MyData {
  id: string;
  name: string;
  createdAt: Date;
}
```

2. Use generic DB utilities in `app/src/lib/server/db.ts`:

```typescript
import { getAllDocuments, getDocumentById, setDocument } from '$lib/server/db';

// Get all documents
const items = await getAllDocuments<MyData>('my-collection');

// Get one document
const item = await getDocumentById<MyData>('my-collection', 'doc-id');

// Create/update document
await setDocument('my-collection', 'doc-id', { name: 'Example' });
```

3. Create an API route in `app/src/routes/api/my-data/+server.ts`:

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth';
import { getAllDocuments } from '$lib/server/db';

export const GET: RequestHandler = async (event) => {
  const auth = await requireAuth(event);
  if (auth instanceof Response) return auth;

  const data = await getAllDocuments('my-collection');
  return json({ data });
};
```

### API Routes

All API routes use server-side Firebase Admin SDK for database operations:

```typescript
import { json } from '@sveltejs/kit';
import { getAllDocuments, setDocument } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const documents = await getAllDocuments('your-collection');
  return json({ data: documents });
};

export const POST: RequestHandler = async (event) => {
  const body = await event.request.json();
  await setDocument('your-collection', 'doc-id', body);
  return json({ success: true });
};
```

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## MCP Server Setup (Optional)

The MCP server allows Claude Code to interact with your Firestore database.

1. Build the MCP server:
```bash
cd mcp-server
npm run build
```

2. Configure MCP (create `~/.config/claude-code/mcp.json` or project-local `mcp.json`):
```json
{
  "mcpServers": {
    "firestore": {
      "command": "node",
      "args": ["/path/to/mcp-server/build/index.js"],
      "env": {
        "FIREBASE_PROJECT_ID": "your-project-id",
        "FIREBASE_CLIENT_EMAIL": "your-client-email",
        "FIREBASE_PRIVATE_KEY": "your-private-key"
      }
    }
  }
}
```

3. Available MCP tools:
   - `list_documents` - List all documents in a collection
   - `get_document` - Get a specific document
   - `create_document` - Create a new document
   - `update_document` - Update an existing document
   - `delete_document` - Delete a document

## Customization

### Change App Name
1. Update `app/src/lib/components/Sidebar.svelte` - Change "My App" branding
2. Update `app/src/routes/+page.svelte` - Update welcome message
3. Update `app/package.json` - Change "name" field
4. Update `mcp-server/package.json` - Change "name" field

### Customize Navigation
Edit `app/src/lib/components/Sidebar.svelte` to add/remove navigation items:
```typescript
const navItems = [
  { id: 'home', label: 'Home', href: '/', icon: 'home' },
  { id: 'example', label: 'Example', href: '/example', icon: 'box' }
];
```

### Styling
- Tailwind config: `app/tailwind.config.js`
- Global styles: `app/src/app.css`
- Extend Tailwind theme as needed

## Tech Stack Details

- **SvelteKit 2**: Latest version with Svelte 5 runes
- **Firebase 12**: Latest Firebase SDK
- **Tailwind 3**: With forms and typography plugins
- **TypeScript 5**: Full type safety
- **Vite 7**: Fast build tool
- **Vercel**: Serverless deployment

## Security

- All Firebase operations are server-side only (Firebase Admin SDK)
- No client-side Firebase SDK exposed
- Firestore security rules configured for server-only access
- Environment variables for sensitive credentials
- HTTPS enforced in production
- Add your own authentication layer as needed

## License

MIT

## Support

For issues or questions:
1. Check existing documentation
2. Review Firebase/SvelteKit docs
3. Create an issue in the repository

---

Built with ❤️ using SvelteKit, Firebase, and Vercel
