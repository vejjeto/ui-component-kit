export type PlaygroundPropValue = string | boolean;

export interface PropDocRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface PlaygroundControl {
  key: string;
  label: string;
  kind: "select" | "boolean" | "text";
  options?: string[];
}

export interface ComponentSpec {
  slug: string;
  name: string;
  category:
    | "Acciones"
    | "Formularios"
    | "Superposiciones"
    | "Navegación"
    | "Datos";
  summary: string;
  props: PropDocRow[];
  a11y: string[];
  controls: PlaygroundControl[];
  defaultState: Record<string, PlaygroundPropValue>;
  buildCode: (state: Record<string, PlaygroundPropValue>) => string;
}

export const COMPONENT_CATALOG: ComponentSpec[] = [
  {
    slug: "button",
    name: "Button",
    category: "Acciones",
    summary:
      "Botón polimórfico con variantes semánticas vía cva, estado de carga accesible, iconos laterales y composición asChild.",
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
        defaultValue: '"primary"',
        description: "Variante visual semántica conectada a los tokens CSS.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "icon"',
        defaultValue: '"md"',
        description: "Escala tipográfica y área interactiva.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description:
          "Muestra spinner, deshabilita interacción y fija aria-busy.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Fusiona props y ref sobre el elemento hijo (p. ej. Link).",
      },
      {
        name: "leftIcon / rightIcon",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Iconos decorativos alineados junto al texto.",
      },
    ],
    a11y: [
      "Usa <button type='button'> por defecto para evitar envíos accidentales en formularios.",
      "Anillo de enfoque visible (:focus-visible) con contraste alto usando --ring.",
      "El estado loading expone aria-busy='true' y bloquea clicks duplicados.",
    ],
    controls: [
      {
        key: "variant",
        label: "Variant",
        kind: "select",
        options: ["primary", "secondary", "outline", "ghost", "danger"],
      },
      {
        key: "size",
        label: "Size",
        kind: "select",
        options: ["sm", "md", "lg", "icon"],
      },
      { key: "loading", label: "Loading", kind: "boolean" },
      { key: "disabled", label: "Disabled", kind: "boolean" },
      { key: "label", label: "Label", kind: "text" },
    ],
    defaultState: {
      variant: "primary",
      size: "md",
      loading: false,
      disabled: false,
      label: "Guardar cambios",
    },
    buildCode: (s) => `<Button
  variant="${String(s.variant)}"
  size="${String(s.size)}"${s.loading ? "\n  loading" : ""}${s.disabled ? "\n  disabled" : ""}
>
  ${String(s.label)}
</Button>`,
  },
  {
    slug: "input",
    name: "Input & TextField",
    category: "Formularios",
    summary:
      "Campo de texto accesible con adornos prefix/suffix, etiqueta vinculada, texto de ayuda y validación aria-invalid.",
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: "undefined",
        description: "Etiqueta asociada vía htmlFor.",
      },
      {
        name: "helperText",
        type: "string",
        defaultValue: "undefined",
        description: "Descripción vinculada mediante aria-describedby.",
      },
      {
        name: "error",
        type: "string",
        defaultValue: "undefined",
        description: "Mensaje de error con role='alert' y aria-invalid='true'.",
      },
      {
        name: "prefix / suffix",
        type: "React.ReactNode",
        defaultValue: "undefined",
        description: "Adornos internos sin romper el foco.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Estado deshabilitado del input.",
      },
    ],
    a11y: [
      "Genera IDs deterministas con useId() para enlazar label, helperText y error.",
      "Activa aria-invalid='true' y role='alert' automáticamente cuando existe error.",
    ],
    controls: [
      { key: "label", label: "Label", kind: "text" },
      { key: "placeholder", label: "Placeholder", kind: "text" },
      { key: "helperText", label: "Helper Text", kind: "text" },
      { key: "hasError", label: "Simular Error", kind: "boolean" },
      { key: "disabled", label: "Disabled", kind: "boolean" },
    ],
    defaultState: {
      label: "Dominio de producción",
      placeholder: "api.forgeui.dev",
      helperText: "Se usará para firmar tokens CORS.",
      hasError: false,
      disabled: false,
    },
    buildCode: (s) => `<TextField
  label="${String(s.label)}"
  placeholder="${String(s.placeholder)}"
  ${s.hasError ? 'error="Formato de dominio inválido"' : `helperText="${String(s.helperText)}"`}${s.disabled ? "\n  disabled" : ""}
/>`,
  },
  {
    slug: "modal",
    name: "Modal",
    category: "Superposiciones",
    summary:
      "Diálogo modal renderizado con React Portal, trampa de foco cíclica Tab/Shift+Tab y restauración de foco al cerrar.",
    props: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "false",
        description: "Controla la visibilidad del diálogo.",
      },
      {
        name: "onClose",
        type: "() => void",
        defaultValue: "required",
        description: "Callback al pulsar Escape, backdrop o botón cerrar.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Ancho máximo del panel modal.",
      },
      {
        name: "closeOnBackdrop",
        type: "boolean",
        defaultValue: "true",
        description: "Permite cerrar al hacer click fuera del diálogo.",
      },
    ],
    a11y: [
      "Usa role='dialog', aria-modal='true', aria-labelledby y aria-describedby.",
      "Cicla el foco exclusivamente dentro del modal con Tab y Shift+Tab.",
      "Cierra con Escape y devuelve el foco al elemento disparador previo.",
    ],
    controls: [
      {
        key: "size",
        label: "Size",
        kind: "select",
        options: ["sm", "md", "lg"],
      },
      { key: "closeOnBackdrop", label: "Close on Backdrop", kind: "boolean" },
      { key: "title", label: "Title", kind: "text" },
    ],
    defaultState: {
      size: "md",
      closeOnBackdrop: true,
      title: "Confirmar despliegue a producción",
    },
    buildCode: (s) => `<Modal
  open={open}
  onClose={() => setOpen(false)}
  size="${String(s.size)}"
  closeOnBackdrop={${String(s.closeOnBackdrop)}}
  title="${String(s.title)}"
>
  <p>Se publicarán los 12 tokens semánticos.</p>
</Modal>`,
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    category: "Superposiciones",
    summary:
      "Menú contextual con grupos, atajos de teclado, variante destructiva y navegación completa mediante flechas.",
    props: [
      {
        name: "trigger",
        type: "React.ReactNode",
        defaultValue: "required",
        description: "Contenido del botón activador.",
      },
      {
        name: "groups",
        type: "DropdownMenuGroup[]",
        defaultValue: "required",
        description: "Secciones con ítems, iconos y variantes.",
      },
      {
        name: "align",
        type: '"start" | "end"',
        defaultValue: '"start"',
        description: "Alineación horizontal del menú flotante.",
      },
    ],
    a11y: [
      "Implementa role='menu' y role='menuitem' con aria-expanded y aria-haspopup.",
      "Navegación con ArrowDown, ArrowUp, Home, End y cierre con Escape.",
    ],
    controls: [
      {
        key: "align",
        label: "Align",
        kind: "select",
        options: ["start", "end"],
      },
      {
        key: "showDestructive",
        label: "Incluir acción destructiva",
        kind: "boolean",
      },
    ],
    defaultState: {
      align: "start",
      showDestructive: true,
    },
    buildCode: (s) => `<DropdownMenu
  align="${String(s.align)}"
  trigger={<Button variant="outline">Acciones</Button>}
  groups={[
    { label: "Registro", items: [{ id: "dup", label: "Duplicar", shortcut: "⌘D" }] },${
      s.showDestructive
        ? '\n    { items: [{ id: "del", label: "Eliminar", variant: "destructive" }] },'
        : ""
    }
  ]}
/>`,
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Navegación",
    summary:
      "Pestañas accesibles horizontales o verticales con indicador animado y navegación por teclado.",
    props: [
      {
        name: "items",
        type: "TabItem[]",
        defaultValue: "required",
        description: "Lista de pestañas con id, label y content.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Eje visual y de teclado.",
      },
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "first item",
        description: "Pestaña activa inicial.",
      },
    ],
    a11y: [
      "Asocia role='tablist', role='tab' (aria-selected) y role='tabpanel' (aria-labelledby).",
      "Flechas izquierda/derecha o arriba/abajo más Home/End cambian foco y selección.",
    ],
    controls: [
      {
        key: "orientation",
        label: "Orientation",
        kind: "select",
        options: ["horizontal", "vertical"],
      },
    ],
    defaultState: {
      orientation: "horizontal",
    },
    buildCode: (s) => `<Tabs
  orientation="${String(s.orientation)}"
  items={[
    { id: "tokens", label: "Tokens", content: <p>Variables CSS...</p> },
    { id: "aria", label: "Accesibilidad", content: <p>WAI-ARIA 1.2...</p> },
  ]}
/>`,
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Superposiciones",
    summary:
      "Cola de notificaciones no intrusivas con barra de progreso de auto-cierre y variantes semánticas.",
    props: [
      {
        name: "variant",
        type: '"info" | "success" | "warning" | "error"',
        defaultValue: '"info"',
        description: "Tono e icono semántico.",
      },
      {
        name: "title",
        type: "string",
        defaultValue: "required",
        description: "Título principal del aviso.",
      },
      {
        name: "description",
        type: "string",
        defaultValue: "undefined",
        description: "Detalle secundario opcional.",
      },
      {
        name: "durationMs",
        type: "number",
        defaultValue: "4000",
        description: "Tiempo antes de auto-descartar (0 = persistente).",
      },
    ],
    a11y: [
      "Contenedor con aria-live='polite' para anunciar avisos sin interrumpir al usuario.",
      "Botón explícito de cierre accesible por teclado.",
    ],
    controls: [
      {
        key: "variant",
        label: "Variant",
        kind: "select",
        options: ["info", "success", "warning", "error"],
      },
      { key: "title", label: "Title", kind: "text" },
      { key: "description", label: "Description", kind: "text" },
    ],
    defaultState: {
      variant: "success",
      title: "Preset guardado en localStorage",
      description: "Los tokens se sincronizaron correctamente.",
    },
    buildCode: (s) => `const { toast } = useToast();

toast({
  variant: "${String(s.variant)}",
  title: "${String(s.title)}",
  description: "${String(s.description)}",
});`,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Superposiciones",
    summary:
      "Etiqueta flotante activada por hover y foco con posicionamiento en 4 direcciones y retardo configurable.",
    props: [
      {
        name: "content",
        type: "React.ReactNode",
        defaultValue: "required",
        description: "Texto o contenido breve del tooltip.",
      },
      {
        name: "placement",
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: '"top"',
        description: "Posición relativa al disparador.",
      },
      {
        name: "delayMs",
        type: "number",
        defaultValue: "200",
        description: "Retardo en milisegundos antes de mostrarse.",
      },
    ],
    a11y: [
      "Asigna role='tooltip' y vincula aria-describedby al disparador cuando está visible.",
      "Se activa también por foco de teclado y se oculta con Escape.",
    ],
    controls: [
      {
        key: "placement",
        label: "Placement",
        kind: "select",
        options: ["top", "bottom", "left", "right"],
      },
      {
        key: "delayMs",
        label: "Delay (ms)",
        kind: "select",
        options: ["0", "200", "500"],
      },
      { key: "content", label: "Content", kind: "text" },
    ],
    defaultState: {
      placement: "top",
      delayMs: "200",
      content: "Atajo global ⌘K",
    },
    buildCode: (
      s,
    ) => `<Tooltip placement="${String(s.placement)}" delayMs={${String(s.delayMs)}} content="${String(s.content)}">
  <Button variant="outline">Pasa el cursor o enfoca</Button>
</Tooltip>`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Navegación",
    summary:
      "Paneles colapsables en modo único o múltiple con animación fluida basada en CSS grid-template-rows.",
    props: [
      {
        name: "items",
        type: "AccordionItem[]",
        defaultValue: "required",
        description: "Secciones con título, subtítulo y contenido.",
      },
      {
        name: "type",
        type: '"single" | "multiple"',
        defaultValue: '"single"',
        description: "Permite una o múltiples secciones abiertas.",
      },
      {
        name: "defaultOpenIds",
        type: "string[]",
        defaultValue: "[]",
        description: "IDs expandidos inicialmente.",
      },
    ],
    a11y: [
      "Cada cabecera expone aria-expanded y aria-controls hacia su panel role='region'.",
      "Animación sin medición JS del DOM gracias a grid-template-rows: 0fr -> 1fr.",
    ],
    controls: [
      {
        key: "type",
        label: "Type",
        kind: "select",
        options: ["single", "multiple"],
      },
    ],
    defaultState: {
      type: "single",
    },
    buildCode: (s) => `<Accordion
  type="${String(s.type)}"
  defaultOpenIds={["item-1"]}
  items={[
    { id: "item-1", title: "Cero FOUC", content: "Script inline previo a hidratación." },
    { id: "item-2", title: "Focus Trap", content: "Navegación cíclica nativa sin dependencias." },
  ]}
/>`,
  },
  {
    slug: "combobox",
    name: "Combobox",
    category: "Formularios",
    summary:
      "Selector buscable con filtrado en vivo, navegación por flechas, botón de limpieza y estado vacío.",
    props: [
      {
        name: "options",
        type: "ComboboxOption[]",
        defaultValue: "required",
        description: "Opciones disponibles con label y descripción.",
      },
      {
        name: "value",
        type: "string",
        defaultValue: '""',
        description: "Valor seleccionado actual.",
      },
      {
        name: "clearable",
        type: "boolean",
        defaultValue: "true",
        description: "Muestra botón para limpiar selección.",
      },
      {
        name: "emptyMessage",
        type: "string",
        defaultValue: '"Sin resultados..."',
        description: "Texto cuando el filtro no arroja coincidencias.",
      },
    ],
    a11y: [
      "Implementa role='combobox', aria-expanded, aria-activedescendant y role='listbox'.",
      "ArrowUp/ArrowDown recorren coincidencias, Enter selecciona y Escape cierra.",
    ],
    controls: [
      { key: "clearable", label: "Clearable", kind: "boolean" },
      { key: "placeholder", label: "Placeholder", kind: "text" },
    ],
    defaultState: {
      clearable: true,
      placeholder: "Elegir framework o entorno...",
    },
    buildCode: (s) => `<Combobox
  clearable={${String(s.clearable)}}
  placeholder="${String(s.placeholder)}"
  value={value}
  onValueChange={setValue}
  options={options}
/>`,
  },
  {
    slug: "datepicker",
    name: "DatePicker",
    category: "Formularios",
    summary:
      "Calendario sin dependencias externas con soporte para fecha única y rango normalizado, indicador de hoy y navegación por teclado.",
    props: [
      {
        name: "mode",
        type: '"single" | "range"',
        defaultValue: '"single"',
        description: "Selecciona una fecha o un intervalo start/end.",
      },
      {
        name: "value",
        type: "string | null",
        defaultValue: "null",
        description: "Fecha ISO YYYY-MM-DD en modo single.",
      },
      {
        name: "range",
        type: "{ start: string | null; end: string | null }",
        defaultValue: "{ start: null, end: null }",
        description: "Rango en modo range.",
      },
    ],
    a11y: [
      "Cuadrícula role='grid' con flechas direccionales (izquierda/derecha/arriba/abajo).",
      "Cada celda expone fecha legible por lector de pantalla y aria-pressed.",
    ],
    controls: [
      {
        key: "mode",
        label: "Mode",
        kind: "select",
        options: ["single", "range"],
      },
    ],
    defaultState: {
      mode: "range",
    },
    buildCode: (s) => `<DatePicker
  mode="${String(s.mode)}"
  ${s.mode === "single" ? "value={date}\n  onValueChange={setDate}" : "range={range}\n  onRangeChange={setRange}"}
/>`,
  },
  {
    slug: "datatable",
    name: "DataTable",
    category: "Datos",
    summary:
      "Tabla genérica tipada <DataTable<T>> con ordenación multicriterio, búsqueda en vivo, paginación y skeleton loading.",
    props: [
      {
        name: "data",
        type: "T[]",
        defaultValue: "required",
        description: "Arreglo tipado de filas.",
      },
      {
        name: "columns",
        type: "DataTableColumn<T>[]",
        defaultValue: "required",
        description: "Definición de columnas, sort y render.",
      },
      {
        name: "searchable",
        type: "boolean",
        defaultValue: "true",
        description: "Habilita caja de búsqueda instantánea.",
      },
      {
        name: "pageSize",
        type: "number",
        defaultValue: "5",
        description: "Cantidad de filas por página.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "Muestra filas skeleton animadas.",
      },
    ],
    a11y: [
      "Cabeceras ordenables exponen aria-sort ('ascending' | 'descending' | 'none').",
      "Controles de paginación con aria-label explícitos y estado disabled.",
    ],
    controls: [
      { key: "searchable", label: "Searchable", kind: "boolean" },
      { key: "loading", label: "Loading Skeleton", kind: "boolean" },
      {
        key: "pageSize",
        label: "Page Size",
        kind: "select",
        options: ["3", "5", "8"],
      },
    ],
    defaultState: {
      searchable: true,
      loading: false,
      pageSize: "3",
    },
    buildCode: (s) => `<DataTable
  data={rows}
  columns={columns}
  rowKey={(row) => row.id}
  searchable={${String(s.searchable)}}
  loading={${String(s.loading)}}
  pageSize={${String(s.pageSize)}}
/>`,
  },
  {
    slug: "command-palette",
    name: "CommandPalette",
    category: "Navegación",
    summary:
      "Paleta global Cmd/Ctrl + K con motor de búsqueda difusa (fuzzy scoring), resaltado de coincidencias y comandos agrupados.",
    props: [
      {
        name: "commands",
        type: "CommandItem[]",
        defaultValue: "required",
        description: "Comandos agrupados con keywords y atajos.",
      },
      {
        name: "open",
        type: "boolean",
        defaultValue: "false",
        description: "Controla la apertura de la paleta.",
      },
      {
        name: "enableGlobalShortcut",
        type: "boolean",
        defaultValue: "true",
        description: "Escucha Cmd/Ctrl + K globalmente.",
      },
    ],
    a11y: [
      "Dialog modal con foco automático en el campo de búsqueda.",
      "Navegación ArrowUp/ArrowDown, Enter para ejecutar y Escape para cerrar.",
    ],
    controls: [{ key: "placeholder", label: "Placeholder", kind: "text" }],
    defaultState: {
      placeholder: "Buscar componente o acción...",
    },
    buildCode: (s) => `<CommandPalette
  open={open}
  onOpenChange={setOpen}
  placeholder="${String(s.placeholder)}"
  commands={commands}
/>`,
  },
];

export function getComponentSpec(slug: string): ComponentSpec | undefined {
  return COMPONENT_CATALOG.find((item) => item.slug === slug);
}
