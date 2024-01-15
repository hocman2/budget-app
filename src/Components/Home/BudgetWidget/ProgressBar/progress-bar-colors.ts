// we must specify all colors in this typescript file so tailwind can compile them even if they aren't
// used anywhere else

// Must be class names that will be available in the ProgressBar.svelte file, cannot use direct
// color values
export enum ProgressColors {
    AccentLight = "bg-accent-light",
    Valid = "bg-valid",
    Warning = "bg-warning",
    Error = "bg-error",
}