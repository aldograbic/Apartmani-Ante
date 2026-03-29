<script>
  import Select from "svelte-select";

  export let value = undefined;
  export let items = [];
  export let placeholder = "Odaberi...";
  export let clearable = false;
  export let searchable = false;
  export let multiple = false;
  export let variant = "dark";
</script>

<div class="select-wrap select-wrap--{variant}">
  <Select
    {items}
    {placeholder}
    {clearable}
    {searchable}
    {multiple}
    bind:value
    on:change
    on:clear
    showChevron
    --border="none"
    --border-radius="0"
    --border-focused="none"
    --outline="none"
    --background="transparent"
    --color={variant === "dark" ? "white" : "#1a2e2c"}
    --placeholder-color={variant === "dark"
      ? "rgba(255,255,255,0.4)"
      : "rgba(26,46,44,0.4)"}
    --font-size="0.82rem"
    --height="24px"
    --padding="0"
    --value-color={variant === "dark" ? "white" : "#1a2e2c"}
    --item-color={variant === "dark" ? "white" : "#1a2e2c"}
    --item-hover-color={variant === "dark" ? "white" : "#1a2e2c"}
    --item-hover-bg={variant === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.04)"}
    --item-active-background={variant === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.06)"}
    --list-background={variant === "dark" ? "#111827" : "#ffffff"}
    --list-border={variant === "dark"
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(26,46,44,0.08)"}
    --list-border-radius="0.85rem"
    --list-shadow="0 10px 30px rgba(0,0,0,0.35)"
    --chevron-color={variant === "dark"
      ? "rgba(255,255,255,0.3)"
      : "rgba(26,46,44,0.4)"}
    --clear-icon-color={variant === "dark"
      ? "rgba(255,255,255,0.4)"
      : "rgba(26,46,44,0.4)"}
  />
</div>

<style>
  .select-wrap {
    width: 100%;
    min-width: 0;
  }

  :global(.svelte-select) {
    font-family: var(--font-body) !important;
    min-width: 0;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  :global(.svelte-select *) {
    box-sizing: border-box;
  }

  :global(.svelte-select .control) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    min-height: 0 !important;
    height: auto !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
  }

  :global(.svelte-select:hover .control),
  :global(.svelte-select.focused .control),
  :global(.svelte-select:focus .control) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  :global(.svelte-select .value-container) {
    padding: 0 !important;
    margin: 0 !important;
    min-height: 0 !important;
    display: flex !important;
    align-items: center !important;
  }

  :global(.svelte-select .input-container) {
    padding: 0 !important;
    margin: 0 !important;
    min-height: 0 !important;
  }

  :global(.svelte-select input) {
    background: transparent !important;
    color: inherit !important;
    caret-color: currentColor !important;
    font-family: var(--font-body) !important;
    font-size: 0.82rem !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  :global(.svelte-select .selected-item) {
    color: inherit !important;
    font-family: var(--font-body) !important;
    font-size: 0.82rem !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .select-wrap--dark :global(.svelte-select-list) {
    background: #111827 !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }

  .select-wrap--light :global(.svelte-select-list) {
    background: #ffffff !important;
    color: #3a3a32 !important;
    border: 1px solid #e6dcc8 !important;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04) !important;
  }

  .select-wrap--light :global(.svelte-select-list .item) {
    color: #3a3a32 !important;
  }

  .select-wrap--light :global(.svelte-select-list .item:hover) {
    background: rgba(30, 92, 90, 0.06) !important;
    color: #1e5c5a !important;
  }

  .select-wrap--light :global(.svelte-select-list .item.active) {
    background: rgba(30, 92, 90, 0.08) !important;
    color: #1e5c5a !important;
  }

  .select-wrap--dark {
    color: white;
  }

  .select-wrap--light {
    color: #3a3a32;
  }

  .select-wrap--dark :global(.svelte-select .placeholder) {
    color: rgba(255, 255, 255, 0.4) !important;
  }

  .select-wrap--light :global(.svelte-select .placeholder) {
    color: #c8c0b4 !important;
  }

  :global(.svelte-select .placeholder) {
    font-family: var(--font-body) !important;
    font-size: 0.82rem !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  :global(.svelte-select .indicators) {
    gap: 0.2rem;
  }

  :global(.svelte-select svg) {
    fill: rgba(255, 255, 255, 0.3) !important;
    color: rgba(255, 255, 255, 0.3) !important;
  }

  :global(.svelte-select-list) {
    font-family: var(--font-body) !important;
    font-size: 0.9rem !important;
    padding: 0.5rem !important;
    margin-top: 0.5rem !important;
    background: #111827 !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 0.85rem !important;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.35),
      0 2px 8px rgba(0, 0, 0, 0.2) !important;
    backdrop-filter: blur(10px);
    z-index: 9999 !important;
  }

  :global(.svelte-select-list .item) {
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    min-height: 52px !important;
    padding: 10px 16px !important;
    border-radius: 10px !important;
    font-size: 0.85rem !important;
    letter-spacing: 0.01em !important;
    color: rgba(255, 255, 255, 0.88) !important;
    background: transparent !important;
    transition:
      background 0.15s ease,
      color 0.15s ease !important;
  }

  :global(.svelte-select-list .item:hover) {
    background: rgba(255, 255, 255, 0.06) !important;
    color: white !important;
  }

  :global(.svelte-select-list .item.active) {
    background: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }

  :global(.svelte-select-list .item.active::before) {
    content: none !important;
  }
</style>
