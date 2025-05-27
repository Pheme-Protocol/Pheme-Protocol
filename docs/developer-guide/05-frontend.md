# Frontend Development Guide

This guide covers the frontend architecture and development practices for Pheme Chat.

## Component Architecture

### Core Components

- `PhemeChat.tsx`: Main chat interface
- `ConnectButton.tsx`: Wallet connection component
- `Web3ModalProvider.tsx`: Web3 context provider
- `PhemeLogo.tsx`: Brand assets

### Component Guidelines

1. **File Structure**
```
components/
├── common/         # Shared components
├── layout/         # Layout components
├── web3/          # Web3 related components
└── chat/          # Chat interface components
```

2. **Naming Conventions**
- Use PascalCase for component names
- Use camelCase for file names
- Add `.tsx` extension for TypeScript components

## State Management

### Web3 State
```typescript
const { isConnected, address } = useAccount();
const { connect } = useConnect();
```

### Chat State
```typescript
interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

const [messages, setMessages] = useState<Message[]>([]);
```

## API Integration

### Chat API
```typescript
const sendMessage = async (message: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return response.json();
};
```

## Styling Guidelines

### TailwindCSS Usage
- Use utility classes for styling
- Create custom components for repeated patterns
- Follow mobile-first approach

### Theme Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937'
      }
    }
  }
};
```

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { PhemeChat } from './PhemeChat';

describe('PhemeChat', () => {
  it('renders chat interface', () => {
    render(<PhemeChat />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

## Performance Optimization

1. **Code Splitting**
   - Use dynamic imports for large components
   - Lazy load routes and heavy dependencies

2. **Image Optimization**
   - Use Next.js Image component
   - Implement proper loading strategies

3. **Web3 Connection**
   - Implement connection pooling
   - Handle reconnection gracefully

## Error Handling

```typescript
try {
  // API calls or Web3 interactions
} catch (error) {
  console.error('Error:', error);
  // User-friendly error handling
}
```

## Development Workflow

1. Create feature branch
2. Implement changes
3. Write tests
4. Create pull request
5. Code review
6. Merge to main

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs) 
