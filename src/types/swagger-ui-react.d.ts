declare module 'swagger-ui-react' {
  interface SwaggerUIProps {
    spec: any;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelsExpandDepth?: number;
  }

  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
} 