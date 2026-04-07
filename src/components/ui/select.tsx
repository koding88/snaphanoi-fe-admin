"use client";

import { Select } from "@base-ui/react/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCheck, faChevronDown } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
  description?: string;
};

type AppSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function AppSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  disabled = false,
}: AppSelectProps) {
  return (
    <Select.Root
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      value={value}
      onValueChange={(nextValue) => onChange(String(nextValue ?? ""))}
      disabled={disabled}
    >
      <Select.Trigger
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,247,241,0.92))] px-4 text-left text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-200 hover:border-[--color-brand]/30 hover:bg-white/95 active:scale-[0.996] focus-visible:border-[--color-brand]/40 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-[--color-brand]/12 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
      >
        <Select.Value
          placeholder={
            <span className="text-muted-foreground/80">{placeholder}</span>
          }
        />
        <Select.Icon className="text-xs text-muted-foreground">
          <FontAwesomeIcon icon={faChevronDown} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={10}>
          <Select.Popup className="dialog-enter z-[80] w-[var(--anchor-width)] overflow-hidden rounded-[1.4rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.96))] p-1.5 shadow-[0_24px_64px_rgba(15,23,42,0.16)] outline-none">
            <Select.List className="max-h-72 overflow-y-auto">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-[1rem] border border-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-all duration-200 hover:border-[--color-brand]/14 hover:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] data-[highlighted]:border-[--color-brand]/16 data-[highlighted]:bg-[linear-gradient(180deg,rgba(185,125,70,0.16),rgba(185,125,70,0.1))] data-[highlighted]:shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] data-[selected]:bg-[linear-gradient(180deg,rgba(185,125,70,0.18),rgba(185,125,70,0.12))]"
                >
                  <div className="min-w-0">
                    <Select.ItemText className="block font-medium transition-transform duration-200 group-hover:translate-x-0.5">
                      {option.label}
                    </Select.ItemText>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground/72">
                        {option.description}
                      </span>
                    ) : null}
                  </div>
                  <Select.ItemIndicator className="text-[--color-brand] transition-transform duration-200 group-hover:scale-105">
                    <FontAwesomeIcon icon={faCheck} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
