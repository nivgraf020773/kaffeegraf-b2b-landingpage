import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface DSGVOConsentProps {
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  showCheckbox?: boolean;
  className?: string;
}

export default function DSGVOConsent({
  isChecked = false,
  onChange,
  showCheckbox = false,
  className = '',
}: DSGVOConsentProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {showCheckbox && (
        <div className="flex items-start gap-3">
          <Checkbox
            id="dsgvo-consent"
            checked={isChecked}
            onCheckedChange={onChange}
            className="mt-1"
          />
          <label
            htmlFor="dsgvo-consent"
            className="text-xs md:text-sm text-muted-foreground leading-relaxed cursor-pointer"
          >
            Ich habe die{' '}
            <a
              href="https://kaffeegraf.coffee/datenschutzerklaerung/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Datenschutzerklärung
            </a>{' '}
            gelesen und stimme zu
          </label>
        </div>
      )}

      {/* DSGVO consent text (always shown) */}
      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
        Mit Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{' '}
        <a
          href="https://kaffeegraf.coffee/datenschutzerklaerung/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Datenschutzerklärung
        </a>{' '}
        zu.
      </p>
    </div>
  );
}
