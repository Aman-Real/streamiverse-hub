import { Check, LoaderCircle, Pencil, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import DetailRow from "@/components/common/DetailRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableFieldProps {
  label: string;
  value: string;
  /** Saves the new value. Throw to keep the editor open; the thrown message is shown under the field. */
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
  /** Returns an error message for an invalid value, or null. Runs on the trimmed value. */
  validate?: (value: string) => string | null;
}

/**
 * A card row that shows a value with an edit button; editing swaps in an input with Save and Cancel.
 * Enter saves, Escape cancels. Reusable for any single text field the account owns.
 */
const EditableField = ({ label, value, onSave, placeholder, maxLength, validate }: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    setDraft(value);
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next = draft.trim();
    const problem = validate?.(next) ?? null;
    if (problem) {
      setError(problem);
      return;
    }
    if (next === value) {
      cancel();
      return;
    }
    setSaving(true);
    try {
      await onSave(next);
      setEditing(false);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <DetailRow
        title={label}
        description={value || placeholder}
        action={
          <Button variant="ghost" size="icon" aria-label={`Edit ${label.toLowerCase()}`} onClick={startEditing}>
            <Pencil />
          </Button>
        }
      />
    );
  }

  return (
    <DetailRow title={<label htmlFor={inputId}>{label}</label>}>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          id={inputId}
          ref={inputRef}
          value={draft}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={saving}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={event => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={event => {
            if (event.key === "Escape") cancel();
          }}
          className="h-10 flex-1 rounded-full bg-background px-4"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1 sm:flex-none" disabled={saving}>
            {saving ? <LoaderCircle className="animate-spin" /> : <Check />}
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" size="sm" className="flex-1 sm:flex-none" disabled={saving} onClick={cancel}>
            <X />
            Cancel
          </Button>
        </div>
      </form>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </DetailRow>
  );
};

export default EditableField;
