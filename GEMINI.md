# Reglas Locales Frontend - SecureLife_FrontEnd

## Activación Automática de Skills
- **React Clean Architecture:** `.agents/skills/react-clean-architecture/SKILL.md`
- **Tailwind Design System:** `.agents/skills/tailwind-design-system/SKILL.md`
- **GSAP Interactive Motion:** `.agents/skills/gsap-interactive-motion/SKILL.md`
- **TypeScript Enterprise Standards:** `.agents/skills/typescript-clean-standards/SKILL.md`

## Principios de Construcción
- Componentes en `src/components/ui/` deben ser 100% reciclables.
- Toda vista o sección debe separar presentación de la lógica mediante Custom Hooks tipados.
- Animaciones con GSAP deben usar limpieza estricta con `context.revert()` o `useGSAP`.
