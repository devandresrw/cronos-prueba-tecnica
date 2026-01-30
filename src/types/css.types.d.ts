/**
 * @fileoverview Declaraciones de tipos para archivos CSS y SCSS
 * @description Proporciona soporte de tipos para importaciones de hojas de estilo,
 * incluyendo CSS global, CSS Modules, SCSS y SCSS Modules en proyectos TypeScript/Next.js
 * @author Andrés R.W.
 * @version 1.0.0
 */

/**
 * Módulo para archivos CSS globales
 * Permite importar archivos .css como efectos secundarios (side effects)
 * @example import "./globals.css"
 */
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

/**
 * Módulo para CSS Modules
 * Permite importar archivos .module.css con tipado de clases
 * @example import styles from "./Button.module.css"
 */
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

/**
 * Módulo para archivos SCSS globales
 * Permite importar archivos .scss como efectos secundarios
 * @example import "./globals.scss"
 */
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

/**
 * Módulo para SCSS Modules
 * Permite importar archivos .scss.module con tipado de clases
 * @example import styles from "./Button.scss.module"
 */
declare module "*.scss.module" {
  const classes: Record<string, string>;
  export default classes;
}