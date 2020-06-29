// This is needed to support import of images via ES6 syntax
declare module '*.svg' {
  const content: ElementType<any>;
  export default content;
}
