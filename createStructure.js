import * as fs from 'fs';
import * as path from 'path';

const structure = {
  src: {
    assets: {
      fonts: {},
      images: {},
      icons: {},
    },
    components: {
      common: {
        'Button.tsx': '',
        'Card.tsx': '',
        'Header.tsx': '',
        'Input.tsx': '',
      },
      forms: {
        'FormField.tsx': '',
        'FormContainer.tsx': '',
      },
      screens: {
        home: {},
        auth: {},
      },
    },
    config: {
      'firebase.ts': '',
      'theme.ts': '',
    },
    constants: {
      'colors.ts': '',
      'routes.ts': '',
    },
    hooks: {
      'useAuth.ts': '',
      'useFirestore.ts': '',
    },
    navigation: {
      'AppNavigator.tsx': '',
      'AuthNavigator.tsx': '',
      'HomeNavigator.tsx': '',
    },
    redux: {
      'store.ts': '',
      slices: {
        'authSlice.ts': '',
        'userSlice.ts': '',
      },
    },
    screens: {
      auth: {
        'LoginScreen.tsx': '',
        'SignUpScreen.tsx': '',
      },
      home: {
        'HomeScreen.tsx': '',
        'ProfileScreen.tsx': '',
      },
      jobs: {
        'JobListScreen.tsx': '',
        'JobDetailScreen.tsx': '',
      },
      settings: {
        'SettingsScreen.tsx': '',
      },
    },
    services: {
      'api.ts': '',
      'auth.ts': '',
    },
    utils: {
      'formatters.ts': '',
      'validators.ts': '',
    },
    'App.tsx': '',
  },
};

const createStructure = (basePath, tree) => {
  Object.entries(tree).forEach(([name, value]) => {
    const fullPath = path.join(basePath, name);
    if (typeof value === 'string') {
      fs.writeFileSync(fullPath, value);
      console.log(`✅ File created: ${fullPath}`);
    } else {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Directory created: ${fullPath}`);
      }
      createStructure(fullPath, value);
    }
  });
};

createStructure('.', structure);
