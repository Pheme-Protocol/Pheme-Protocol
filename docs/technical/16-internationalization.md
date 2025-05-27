# 🌍 Internationalization (i18n) Guide

This guide covers how to implement, manage, and contribute to the internationalization of the PHEME Protocol platform.

## Overview

PHEME Protocol supports multiple languages to make the platform accessible to a global audience. This guide explains our i18n architecture, workflow, and best practices.

## Supported Languages

| Language Code | Language Name | Status      | Coverage |
|--------------|---------------|-------------|----------|
| en           | English       | ✅ Complete  | 100%     |
| zh           | Chinese       | 🟡 Partial   | 80%      |
| es           | Spanish       | 🟡 Partial   | 75%      |
| ja           | Japanese      | 🟡 Partial   | 70%      |
| ko           | Korean        | 🟡 Partial   | 70%      |

## Technical Implementation

### Frontend (React)

We use `react-i18next` for frontend translations:

```typescript
// i18n configuration (i18n.ts)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: require('./locales/en.json')
      },
      // other languages...
    }
  });

export default i18n;

// Usage in components
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Backend (Node.js)

For backend messages and errors:

```typescript
// i18n setup (i18n.ts)
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  });

// Usage in API responses
import { t } from 'i18next';

function getErrorMessage(code: string, lang: string) {
  return t('errors.${code}', { lng: lang });
}
```

### Smart Contracts

For on-chain error messages and metadata:

```solidity
// Implement multi-language support for error messages
contract MultiLingualErrors {
    mapping(string => mapping(bytes32 => string)) private errorMessages;
    
    function getErrorMessage(string memory lang, bytes32 errorCode) 
        public view returns (string memory) {
        string memory message = errorMessages[lang][errorCode];
        if (bytes(message).length == 0) {
            return errorMessages["en"][errorCode];
        }
        return message;
    }
}
```

## Translation Workflow

### 1. Key Management

Use nested keys for better organization:

```json
{
  "common": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "auth": {
    "login": {
      "title": "Login",
      "emailPlaceholder": "Enter your email"
    }
  }
}
```

### 2. Translation Process

1. Extract new strings using `i18next-parser`
2. Send to translation team
3. Review translations
4. Deploy updates

```bash
# Extract new translations
yarn i18next 'src/**/*.{js,jsx,ts,tsx}' -o locales/en/translation.json

# Check missing translations
yarn i18next-check
```

## Best Practices

### 1. String Interpolation

Use named variables for better context:

```typescript
// Good
t('welcome.message', { name: userName })

// Avoid
t('welcome.message', { 0: userName })
```

### 2. Pluralization

Use proper plural forms:

```json
{
  "items": {
    "zero": "No items",
    "one": "{{count}} item",
    "other": "{{count}} items"
  }
}
```

### 3. Date and Number Formatting

Use `Intl` for consistent formatting:

```typescript
const formatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
```

### 4. RTL Support

Support right-to-left languages:

```css
/* styles.css */
html[dir='rtl'] {
  .sidebar {
    right: 0;
    left: auto;
  }
}
```

## Testing

### 1. Unit Tests

```typescript
describe('Internationalization', () => {
  it('should return correct translation', () => {
    const { t } = useTranslation();
    expect(t('common.welcome')).toBe('Welcome');
  });
});
```

### 2. Integration Tests

```typescript
describe('Language Switching', () => {
  it('should switch language', async () => {
    const { result } = renderHook(() => useTranslation());
    act(() => {
      result.current.i18n.changeLanguage('es');
    });
    expect(result.current.t('common.welcome')).toBe('Bienvenido');
  });
});
```

## Contributing Translations

1. Fork the repository
2. Create a new branch: `git checkout -b translate-[language-code]`
3. Add translations to `locales/[language-code]/translation.json`
4. Submit a pull request

## Quality Assurance

### Translation Review Process

1. Machine translation first pass
2. Native speaker review
3. Technical context review
4. Community feedback

### Automated Checks

```bash
# Check for missing translations
yarn i18n-check

# Validate JSON format
yarn i18n-validate

# Check for unused translations
yarn i18n-unused
```

## Performance Considerations

### 1. Lazy Loading

Load translations on demand:

```typescript
i18next.loadNamespaces(['common'], () => {
  // Namespace loaded
});
```

### 2. Bundle Size Optimization

```typescript
// Separate bundles per language
const loadLanguage = (lang: string) => 
  import(`./locales/${lang}/translation.json`);
```

## Monitoring and Maintenance

### 1. Translation Coverage

Monitor translation completion status:

```bash
yarn i18n-coverage-report
```

### 2. Error Tracking

Track missing translations and errors:

```typescript
i18next.on('missingKey', (lng, ns, key) => {
  // Log missing translation
  logger.warn('Missing translation', { lng, ns, key });
});
``` 
