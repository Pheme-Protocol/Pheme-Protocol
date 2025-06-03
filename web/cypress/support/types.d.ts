/// <reference types="cypress" />

declare namespace Cypress {
  interface AUTWindow {
    Web3Modal: {
      init: () => Promise<{
        connect: () => Promise<{
          provider: any;
          chainId: string;
          accounts: string[];
        }>;
        disconnect: () => void;
        getProvider: () => any;
      }>;
    };
    ethereum: {
      request: (args: any) => Promise<any>;
      on: (event: string, callback: (args: any) => void) => void;
      removeListener: (event: string, callback: (args: any) => void) => void;
      isMetaMask: boolean;
      selectedAddress: string;
      networkVersion: string;
      chainId: string;
      provider: {
        request: (args: any) => Promise<any>;
        on: (event: string, callback: (args: any) => void) => void;
        removeListener: (event: string, callback: (args: any) => void) => void;
      };
      enable: () => Promise<string[]>;
      send: (args: any) => Promise<any>;
      sendAsync: (args: any, callback: (error: any, response: any) => void) => void;
      addListener: (event: string, callback: (args: any) => void) => void;
      removeAllListeners: (event: string) => void;
      getNetwork: () => Promise<{ chainId: string }>;
      getProvider: () => any;
    };
  }
} 