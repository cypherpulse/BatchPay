import { useState, useEffect } from 'react';
import { FileText, UserPlus } from 'lucide-react';
import { CSVUpload } from './CSVUpload';
import { ManualInput } from './ManualInput';
import type { ParsedCSV, Recipient } from '@/types/payment';

interface RecipientInputProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
  onParsed: (data: ParsedCSV) => void;
  onClear: () => void;
}

export function RecipientInput({
  recipients,
  onRecipientsChange,
  onParsed,
  onClear
}: RecipientInputProps) {
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
  const [tabKey, setTabKey] = useState(0);

  // Reset any lingering file inputs when tab changes
  useEffect(() => {
    // Clear any file input values that might be lingering
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      (input as HTMLInputElement).value = '';
    });
    // Force remount by changing key
    setTabKey(prev => prev + 1);
  }, [activeTab]);

  const tabs = [
    {
      id: 'csv' as const,
      label: 'Upload CSV',
      icon: FileText,
      description: 'Import recipients from a CSV file'
    },
    {
      id: 'manual' as const,
      label: 'Add Manually',
      icon: UserPlus,
      description: 'Enter recipients one by one'
    }
  ];

  return (
    <section id="recipients" className="py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Add Recipients
            </h2>
            <p className="text-muted-foreground">
              Choose how you'd like to add your payment recipients
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex rounded-xl bg-muted p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'csv' ? (
              <CSVUpload
                key={`csv-${tabKey}`}
                onParsed={onParsed}
                onClear={onClear}
                hasData={recipients.length > 0}
              />
            ) : (
              <ManualInput
                key={`manual-${tabKey}`}
                recipients={recipients}
                onRecipientsChange={onRecipientsChange}
              />
            )}
          </div>

          {/* Tab Descriptions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}