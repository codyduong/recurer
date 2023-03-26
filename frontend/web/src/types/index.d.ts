/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    __APOLLO_STATE__: any;
    __GRAPHQLURL__: string;
    __TOKEN__: string;
  }
}

declare module '*.svg' {
  import * as React from 'react';

  export default src as React.FunctionComponent<React.SVGProps<SVGElement>>;
}

export {};
